import { iTemperWS } from '@/config';
import { json } from '@/helpers/';
import { log } from '@/services/logger';

import { Descriptor, SensorLog } from '@/models/sensor-data';

export enum ClientCommand {
    START_MONITOR = 'startMonitor',
    STOP_MONITOR = 'stopMonitor',
 }

export interface ClientMessage {
    command: ClientCommand;
    data: any;
}

export enum ServerCommand {
    SENSORS = 'sensors',
    SETTINGS = 'settings',
    SETTING = 'setting',
    LOG = 'log'}

export interface ServerMessage {
    command: ServerCommand;
    data: any;
}

export interface IMonitor {
    SubscribeSensorLog(desc: Descriptor, publish: (log: SensorLog) => void): void;
    send(msg: ClientMessage): void;
}

export class Monitor implements IMonitor {
    private static allSubscribers = new Map();
    private static ws: WebSocket;

    constructor() {
        if (!Monitor.ws) {
            this.connectMonitor()
            .then((ws) => {
                Monitor.ws = ws;
                this.send({command: ClientCommand.START_MONITOR, data: {}});
            })
            .catch((err) => log.debug('Monitor: error connecting monitor'));
        }
    }

    public sensorDesc(desc: Descriptor): string {
        return desc.SN + '/' + desc.port;
    }
    public SubscribeSensorLog(desc: Descriptor, publish: (log: SensorLog) => void): void {
        const sensorDesc = this.sensorDesc(desc);
        log.debug('Monitor.SubscribeSensorLog: sensorDesc=' + sensorDesc);
        this.subscribe<SensorLog>(sensorDesc, publish, JSON.parse );
    }

    public send(msg: ClientMessage): void {
        Monitor.ws.send(JSON.stringify(msg));
    }

    private connectMonitor(): Promise<WebSocket> {
        return new Promise<WebSocket> ((resolve, reject) => {
                const url = iTemperWS;
                const server = new WebSocket(url);
                server.onopen = () => {
                    resolve(server);
                };
                server.onmessage = (msg: MessageEvent): void => {
                    this.parse(msg);
                };
                server.onerror = (err) => {
                    reject(err);
                };
        });
    }

    private subscribe<T>(messageDesc: string, publish: (message: T) => void, factory: (payload: string) => T): void {
        const messageSubscriber = {publish, factory};

        let messageSubscribers: Array<{publish: (message: T) => void,
                                factory: (payload: string) => T }> = Monitor.allSubscribers.get(messageDesc);
        log.debug('Monitor.subscribe');
        if (!messageSubscribers) {
            log.debug('Monitor.subscribe: First subscriber of messageDesc=' + messageDesc);
            messageSubscribers = [messageSubscriber];
            Monitor.allSubscribers.set(messageDesc, messageSubscribers);
        } else {
            log.debug('Monitor.subscribe: subscribers of messageDesc=' + messageSubscribers.length);
            const alreadySubscribed = messageSubscribers.find((s) => s.publish === publish && s.factory === factory);

            if (!alreadySubscribed) {
                log.debug('Monitor.subscribe: Added a NEW subscriber of messageDesc=' + messageDesc);
                messageSubscribers.push(messageSubscriber);
                Monitor.allSubscribers.set(messageDesc, messageSubscribers);
            }
        }
    }
    private parse(msg: MessageEvent) {
        log.debug('Monitor.parse: received message from: ' + JSON.stringify(msg.data));
        const serverMessage: ServerMessage = JSON.parse(msg.data);

        if (serverMessage.command === 'log') {
            const desc = serverMessage.data.desc;
            log.debug('Monitor.parse: serverMessage.data.desc=' + this.sensorDesc(desc));
            const subscribers = Monitor.allSubscribers.get(this.sensorDesc(desc));
            if (subscribers) {
                log.debug('Monitor.parse: publish message to subscribers=' + subscribers.length);
                subscribers.forEach((subscriber: any) => {
                    // const message = subscriber.factory(serverMessage.data);
                    subscriber.publish(serverMessage.data);
                });
            } else {
                log.debug('Monitor.parse: no subscribers for server message=' + serverMessage.data);
            }

        } else {
            log.debug('Monitor.parse: no message command in msg=' + JSON.stringify(serverMessage));
        }
    }
}
