import { log } from '@/services/logger';
import * as ble from './itemper-bluetooth-device';
import { DeviceData } from '@/features/devices/device-data';

export const DeviceCharacteristicUUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84542';

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
