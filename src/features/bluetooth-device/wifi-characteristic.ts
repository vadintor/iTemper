import { log } from '@/services/logger';
import * as ble from './bluetooth-service';
import { DeviceWiFiData } from '@/features/devices/device-data';
import { isDeviceWiFiDataValid } from '@/features/devices/device-data-validators';

// SSID (read/write), Encryption (read/write), Password (write)
export const WiFiCharacteristicUUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84541';

export interface WiFiWriteData  {
    ssid: string;
    password: string;
}

export class WiFiCharacteristic {
  private characteristic: BluetoothRemoteGATTCharacteristic;
  constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.characteristic = characteristic;
  }
  public async readValue(): Promise<DeviceWiFiData> {
    log.debug('wifi-characteristic.readValue');
    return  this.characteristic.readValue().then ((value) => {
      const str = ble.decode(value);
      log.info('wifi-characteristic.readValue=' + str);
      const data = JSON.parse(str);
      if (isDeviceWiFiDataValid(data)) {
        return data as DeviceWiFiData;
      } else {
        throw Error ('Invalid device wifi data');
      }
  });
  }
  public async writeValue(value: WiFiWriteData): Promise<void> {
    log.debug('wifi-characteristic.writeValue');
    return  this.characteristic.writeValue(ble.encode(JSON.stringify(value)));
  }
}
