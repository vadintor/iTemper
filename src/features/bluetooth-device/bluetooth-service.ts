import { log } from '@/services/logger';
import { AvailableWiFiCharacteristicUUID, AvailableWiFiCharacteristic} from './available-wifi-characteristics';
import { CurrentWiFiCharacteristicUUID, CurrentWiFiCharacteristic} from './current-wifi-characteristic';
import { DeviceCharacteristicUUID, DeviceCharacteristic} from './device-characteristic';
import { EventEmitter } from 'events';
import { rejects } from 'assert';
import { runInThisContext } from 'vm';

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
  private btDevice: BluetoothDevice | undefined;

  constructor(private onChanged: (newStatus: BtStatus) => void) {
    log.debug('bluetooth-service.constructor');
  }

  public async getCharacteristics(): Promise<BtCharacteristics> {
      const MAX_RETRIES = 3;
      try {
        if (!this.isPaired()) {
          await this.pairDevice();
        }
        this.onChanged(BtStatus.Connecting);
        const service = await this.connect();
        const device = await this.getDevice(service);
        const current = await this.getCurrentWiFi(service);
        const available = await this.getAvailableWiFi(service);
        this.onChanged(BtStatus.Connected);
        log.debug('bluetooth-service.getCharacteristics resolved');
        return { device, current, available };

      } catch {
        throw new Error ('Cannot pair bluetooth device');
      }
  }
    // disconnect from peripheral
    public disconnect() {
      this.onChanged(BtStatus.Disconnecting);
      log.debug('bluetooth-service.disconnect');
      if (this.btDevice && this.btDevice.gatt) {
        return this.btDevice.gatt.disconnect();
      }
    }
  private onDisconnected() {
    this.btDevice = undefined;
    this.onChanged(BtStatus.Disconnected);
  }
  private async pairDevice() {
    try {
        this.btDevice = await navigator.bluetooth.requestDevice(DeviceOptions);
        this.btDevice.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
    } catch {
      throw new Error ('Cannot pair bluetooth device');
    }
  }
  private isPaired() {
    return this.btDevice && this.btDevice.gatt;
  }
  // request connection to a device remote GATT service
  private async connect(): Promise<BluetoothRemoteGATTService> {
      const MAX_RETRIES = 3;
      if (this.btDevice && this.btDevice.gatt && !this.btDevice.gatt.connected) {
          const server = await this.btDevice.gatt.connect();
          return await server.getPrimaryService(DeviceServiceUUID);
      } else {
        throw new Error ('No bluetooth GATT service available');
      }
  }
  private async getDevice(service: BluetoothRemoteGATTService): Promise<DeviceCharacteristic> {
    try {
      const characteristic = await service.getCharacteristic(DeviceCharacteristicUUID);
      return new DeviceCharacteristic(characteristic);
    } catch {
      throw new Error ('Cannot get device characteristics');
    }
  }
  private async getCurrentWiFi(service: BluetoothRemoteGATTService): Promise<CurrentWiFiCharacteristic> {
    try {
      const characteristic = await service.getCharacteristic(CurrentWiFiCharacteristicUUID);
      return new CurrentWiFiCharacteristic(characteristic);
    } catch {
      throw new Error ('Cannot get current WiFi characteristics');
    }
  }
  private async getAvailableWiFi(service: BluetoothRemoteGATTService):
              Promise<AvailableWiFiCharacteristic> {
    try {
      const characteristic = await service.getCharacteristic(AvailableWiFiCharacteristicUUID);
      return new AvailableWiFiCharacteristic(characteristic);
    } catch {
      throw new Error ('Cannot get available network characteristics');
    }
  }
  private async getCharacteristic(service: BluetoothRemoteGATTService,
                                  characteristicUUID: string): Promise<BluetoothRemoteGATTCharacteristic> {
    try {
      log.debug('bluetooth-service.getCharacteristic: ' + characteristicUUID);
      return await service.getCharacteristic(characteristicUUID);
    } catch {
      throw new Error ('Cannot get itemper Bluetooth characteristic: ' + characteristicUUID);
    }

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
async function run<T>(MaxRetries: number, fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
  let retries = 0;
  while (retries <= MaxRetries) {
    try {
      log.info('bluetooth-services.run, arguments: ' + JSON.stringify(fn.arguments));
      return await fn(...args);
    } catch (e) {
      log.error('bluetooth-services.run: ' + JSON.stringify(e));
      if (retries < MaxRetries) {
        await delay(1_000 + retries * 2_000 * Math.random());
      }
      retries += 1;
    }
  }
  throw Error('Cannot run async function');
}
async function delay(ms: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
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
