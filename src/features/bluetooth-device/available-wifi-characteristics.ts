import { log } from '@/services/logger';
import * as ble from './bluetooth-service';
import { WiFiData } from '@/features/devices/device-data';
import { isWiFiDataArrayValid } from '@/features/devices/device-data-validators';

export const AvailableWiFiCharacteristicUUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84540';

export class AvailableWiFiCharacteristic {
  private characteristic: BluetoothRemoteGATTCharacteristic;
  constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.characteristic = characteristic;
  }
  public async readValue(): Promise<WiFiData[]> {
    log.debug('current-wifi-characteristic.readValue');
    return  new Promise((resolve, reject) => {
      this.characteristic.readValue().then ((value) => {
        const str = ble.decode(value);
        log.info('current-wifi-characteristic.readValue=' + str);
        try {
          const data = JSON.parse(str);
          if (isWiFiDataArrayValid(data)) {
            resolve(data);
          } else {
            reject('Invalid wifi data');
          }
        } catch {
            reject('Cannot parse current wifi data');
        }
      });
    });
  }
}
