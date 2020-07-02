
import { log } from '@/services/logger';
import { WiFiCharacteristicUUID, WiFiCharacteristic} from './wifi-characteristic';
import { DeviceCharacteristicUUID, DeviceCharacteristic} from './device-characteristic';

const DeviceServiceUUID = 0xfff1;

const DeviceOptions = {
  filters: [
    {
      name: 'itemperBLE',
    },
  ],
  optionalServices: [DeviceServiceUUID],
};

export interface Characteristics {
  device?: DeviceCharacteristic;
}
export class ItemperBluetoothDevice {
  private device: BluetoothDevice | undefined;

  constructor() {
    log.debug('itemper-ble-service.constructor');
    this.onDisconnected = this.onDisconnected.bind(this);
  }
  // request connection to a device remote GATT service
  public async connect(): Promise<Characteristics>  {
    return navigator.bluetooth.requestDevice(DeviceOptions)
    .then((device) => {
      log.debug('itemper-ble-service.request-device');
      this.device = device;
      device.addEventListener('gattserverdisconnected', this.onDisconnected);
      return device.gatt?.connect();
    })
    .then((server) => {
        log.debug('itemper-ble-service.request-device.gatt');
        return server?.getPrimaryService(DeviceServiceUUID);
    })
    .then((service) => {
      return service?.getCharacteristic(DeviceCharacteristicUUID);
    })
    .then((characteristic) => {
      if (!characteristic) {
        throw Error('Could not find itemperBLE characteristic');
      }
      return { device: characteristic ? new DeviceCharacteristic(characteristic) : undefined};
    });
  }
  public getCharacteristic( service: BluetoothRemoteGATTService,
                            characteristicUUID: string): Promise<BluetoothRemoteGATTCharacteristic> {
        log.debug('itemper-ble-service.getCharacteristic');
        return service.getCharacteristic(characteristicUUID);
  }
  public watchAvailability(availability: (isAvailable: boolean) => void): void {
    log.debug('itemper-ble-service.watchAvailability');
    navigator.permissions.query({name: 'bluetooth'}).then((status: PermissionStatus) => {
      availability(status.state !== 'denied');
      // Bluetooth is blocked, listen for change in PermissionStatus.
      status.onchange = () => {
          availability(status.state !== 'denied');
      };
    });
  }
  // disconnect from peripheral
  public disconnect() {
    log.debug('itemper-ble-service.disconnect');
    if (this.device && this.device.gatt) {
      return this.device.gatt.disconnect();
    } else {
      return Promise.reject('Device is not connected.');
    }
  }
  // handler to run when device successfully disconnects
  public onDisconnected() {
    log.debug('itemper-ble-service.onDisconnect');
    alert('Device is disconnected.');
  }
}
// helper function to decode message sent from peripheral
export function decode(buf: BufferSource): string {
  log.debug('itemper-ble-service.decode');
  const dec = new TextDecoder('utf-8');
  return dec.decode(buf);
}
export function encode(value: string ): BufferSource {
  log.debug('itemper-ble-service.encode');
  const enc = new TextEncoder();
  return enc.encode(value);
}
