import {Sensor } from '@/models/sensor';
export enum MessageType { MONITOR = 'MONITOR', RAW = 'RAW' }
export interface Message {
    msg: MessageType;
    data: Buffer;
}
