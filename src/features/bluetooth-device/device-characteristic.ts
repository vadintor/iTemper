import { log } from '@/services/logger';
import * as ble from './itemper-bluetooth-device';
import { DeviceData } from '@/features/devices/device-data';

export const DeviceCharacteristicUUID = 'a77fb9d7-c7f1-4cd9-8b44-b6f3131744de';

export class DeviceCharacteristic {
  private characteristic: BluetoothRemoteGATTCharacteristic;
  constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.characteristic = characteristic;
  }

  public async writeValue(value: DeviceData): Promise<void> {
    log.debug('device-characteristic.writeValue');
    return  this.characteristic.writeValue(ble.encode(JSON.stringify(value)));
  }
}
