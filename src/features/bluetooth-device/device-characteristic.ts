import { log } from '@/services/logger';
import * as ble from './bluetooth-service';
import { DeviceData } from '@/features/devices/device-data';
import { isDeviceDataValid } from '@/features/devices/device-data-validators';

export const DeviceCharacteristicUUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84542';

export class DeviceCharacteristic {
  private characteristic: BluetoothRemoteGATTCharacteristic;
  constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.characteristic = characteristic;
  }
  public async readValue(): Promise<DeviceData> {
    log.debug('device-characteristic.readValue');
    return  new Promise ((resolve, reject) => {
      this.characteristic.readValue().then ((value) => {
        const str = ble.decode(value);
        log.info('device-characteristic.readValue received str=' + str);
        const data = JSON.parse(str);
        if (isDeviceDataValid(data)) {
          resolve( data as DeviceData);
        } else {
          reject('Invalid device data');
        }
      });
    });

  }
  public async writeValue(value: DeviceData): Promise<void> {
    log.debug('device-characteristic.writeValue');
    return  this.characteristic.writeValue(ble.encode(JSON.stringify(value)));
  }
}
