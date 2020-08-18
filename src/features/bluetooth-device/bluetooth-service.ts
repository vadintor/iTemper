import { log } from '@/services/logger';
import { AvailableWiFiCharacteristicUUID, AvailableWiFiCharacteristic} from './available-wifi-characteristics';
import { CurrentWiFiCharacteristicUUID, CurrentWiFiCharacteristic} from './current-wifi-characteristic';
import { DeviceCharacteristicUUID, DeviceCharacteristic} from './device-characteristic';
import { EventEmitter } from 'events';

const DeviceServiceUUID = 0xfff1;

const DeviceOptions = {
  filters: [
    {
      name: 'itemperBLE',
    },
  ],
  optionalServices: [DeviceServiceUUID],
};
export interface BtCharacteristics {
  device: DeviceCharacteristic;
  current: CurrentWiFiCharacteristic;
  available: AvailableWiFiCharacteristic;
}
export enum BtStatus {Disconnected, Connecting, Connected, Disconnecting}

export class BtService {
  private device: BluetoothDevice | undefined;

  constructor(private onChanged: (newStatus: BtStatus) => void) {
    log.debug('bluetooth-service.constructor');
  }

  public scan(): Promise<BtCharacteristics> {
    return new Promise ((resolve, reject) => {
      this.connect()
      .then((service) => {
        if (!!service) {
          return Promise.all([  this.getDeviceCharacteristic(service),
                                this.getCurrentWiFiCharacteristic(service),
                                this.getAvailableWiFiCharacteristic(service)])
          .then((characteristics) => {
            if (characteristics[0]  && characteristics[1] && characteristics[2]) {
              this.onChanged(BtStatus.Connected);
              log.debug('bluetooth-service.scan resolved characteristics');
              resolve({ device: characteristics[0],
                      current: characteristics[1], available: characteristics[2]});
            } else {
              reject('Some characteristics missing');
            }
          });
        } else {
            reject('No service available');
        }
      });
    });
  }
    // disconnect from peripheral
    public disconnect() {
      this.onChanged(BtStatus.Disconnecting);
      log.debug('bluetooth-service.disconnect');
      if (this.device && this.device.gatt) {
        return this.device.gatt.disconnect();
      }
    }
  private onDisconnected() {
    this.onChanged(BtStatus.Disconnected);
  }
  // request connection to a device remote GATT service
  private async connect(): Promise<BluetoothRemoteGATTService | undefined>  {
    return navigator.bluetooth.requestDevice(DeviceOptions)
    .then((device) => {
      this.onChanged(BtStatus.Connecting);
      log.debug('bluetooth-service.connect');
      this.device = device;
      device.addEventListener('gattserverdisconnected', this.onDisconnected);
      return device.gatt?.connect();
    })
    .then((server) => {
        log.debug('bluetooth-service.request-device.gatt');
        return server?.getPrimaryService(DeviceServiceUUID);
    });
  }
  private getDeviceCharacteristic(service: BluetoothRemoteGATTService): Promise<DeviceCharacteristic | undefined> {
    return service.getCharacteristic(DeviceCharacteristicUUID)
    .then((characteristic) => {
      return !!characteristic ? new DeviceCharacteristic(characteristic) : undefined;
    });
  }
  private getCurrentWiFiCharacteristic(service: BluetoothRemoteGATTService):
              Promise<CurrentWiFiCharacteristic | undefined> {
    return service.getCharacteristic(CurrentWiFiCharacteristicUUID)
    .then((characteristic) => {
      return !!characteristic ?  new CurrentWiFiCharacteristic(characteristic) : undefined;
    });
  }
  private getAvailableWiFiCharacteristic(service: BluetoothRemoteGATTService):
              Promise<AvailableWiFiCharacteristic | undefined> {
    return service.getCharacteristic(AvailableWiFiCharacteristicUUID)
    .then((characteristic) => {
      return !!characteristic ?  new AvailableWiFiCharacteristic(characteristic) : undefined;
    });
  }
  private getCharacteristic(service: BluetoothRemoteGATTService,
                            characteristicUUID: string): Promise<BluetoothRemoteGATTCharacteristic> {
        log.debug('bluetooth-service.getCharacteristic: ' + characteristicUUID);
        return service.getCharacteristic(characteristicUUID);
  }
  private watchAvailability(availability: (isAvailable: boolean) => void): void {
    log.debug('bluetooth-service.watchAvailability');
    navigator.permissions.query({name: 'bluetooth'}).then((status: PermissionStatus) => {
      availability(status.state !== 'denied');
      // Bluetooth is blocked, listen for change in PermissionStatus.
      status.onchange = () => {
          availability(status.state !== 'denied');
      };
    });
  }
  // handler to run when device successfully disconnects
}
// helper function to decode message sent from peripheral
export function decode(buf: BufferSource): string {
  log.debug('bluetooth-service.decode');
  const dec = new TextDecoder('utf-8');
  return dec.decode(buf);
}
export function encode(value: string ): BufferSource {
  log.debug('bluetooth-service.encode');
  const enc = new TextEncoder();
  return enc.encode(value);
}
