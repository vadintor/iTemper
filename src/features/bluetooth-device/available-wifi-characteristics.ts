import { log } from '@/services/logger';
import * as ble from './bluetooth-service';
import { WiFiNetwork } from '@/features/devices/device-data';
import { isWiFiDataArrayValid } from '@/features/devices/device-data-validators';
import { networkInterfaces } from 'os';

export const AvailableWiFiCharacteristicUUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84540';

export class AvailableWiFiCharacteristic {
  private characteristic: BluetoothRemoteGATTCharacteristic;
  constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.characteristic = characteristic;
  }
  public async readValue(): Promise<WiFiNetwork[]> {
    log.debug('available-wifi-characteristics.readValue');
    return  new Promise((resolve, reject) => {
      this.characteristic.readValue().then ((value) => {
        const str = ble.decode(value);
        log.info('available-wifi-characteristics.readValue received' + str);
        try {
          const data = JSON.parse(str);
          if (isWiFiDataArrayValid(data)) {
            const networks: WiFiNetwork[] = [];
            data.forEach((element: string[]) => {
              networks.push({ssid: element[0], security: element[1]});
            });
            resolve(networks);
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
