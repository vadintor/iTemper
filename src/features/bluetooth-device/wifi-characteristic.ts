import { log } from '@/services/logger';
import * as ble from './itemper-bluetooth-device';


// SSID (read/write), Encryption (read/write), Password (write)
export const WiFiCharacteristicUUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84541';

export interface WiFiReadData {
    ssid: string;
    security?: string;
  }
export interface WiFiWriteData extends WiFiReadData {
    password: string;
}

export class WiFiCharacteristic {
  private characteristic: BluetoothRemoteGATTCharacteristic;
  constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.characteristic = characteristic;
  }
  public async readValue(): Promise<WiFiReadData> {
    log.debug('wifi-characteristic.readString');
    return  this.characteristic.readValue().then ((value) => {
              const wifi =  JSON.parse(ble.decode(value)) as WiFiReadData;
              return wifi;
            });
  }
  public async writeValue(value: WiFiWriteData): Promise<void> {
    log.debug('wifi-characteristic.writeString');
    return  this.characteristic.writeValue(ble.encode(JSON.stringify(value)));
  }
}
