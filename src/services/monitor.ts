import { iTemperWS } from '@/config';
import { json } from '@/helpers/';
import { log } from '@/services/logger';

import { Descriptor, SensorLog } from '@/models/sensor';

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
            .then(ws => {
                Monitor.ws = ws;
                this.send({command: ClientCommand.START_MONITOR, data: {}});
            })
            .catch(err => log.debug('Monitor: error connecting monitor'));
        }
    }

    public SubscribeSensorLog(desc: Descriptor, publish: (log: SensorLog) => void): void {
        const sensorDesc = JSON.stringify(desc);
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

        if (!messageSubscribers) {
            messageSubscribers = [messageSubscriber];
            Monitor.allSubscribers.set(messageDesc, messageSubscribers);
        } else {
            const alreadySubscribed = messageSubscribers.find(s => s.publish === publish && s.factory === factory);

            if (!alreadySubscribed) {
                messageSubscribers.push(messageSubscriber);
                Monitor.allSubscribers.set(messageDesc, messageSubscribers);
            }
        }
    }
    private parse(msg: MessageEvent) {
        log.debug('Monitor.parse: received message from: ' + JSON.stringify(msg.data));
        const serverMessage: ServerMessage = JSON.parse(msg.data);

        if (serverMessage.command === 'log') {
            log.debug('Monitor.parse: serverMessage.data.desc=' + JSON.stringify(serverMessage.data.desc));
            const subscribers = Monitor.allSubscribers.get(serverMessage.data.desc);
            if (subscribers) {
                log.debug('Monitor.parse: publish message to subscribers=' + subscribers.length);
                subscribers.forEach((subscriber: any) => {
                    const message = subscriber.factory(serverMessage.data);
                    subscriber.publish(message);
                });
            } else {
                log.debug('Monitor.parse: no subscribers for server message=' + serverMessage.data);
            }

        } else {
            log.debug('Monitor.parse: no message command in msg=' + JSON.stringify(serverMessage));
        }
    }
}
