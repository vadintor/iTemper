import { log } from '@/services/logger';
import { AvailableWiFiCharacteristicUUID, AvailableWiFiCharacteristic} from './available-wifi-characteristics';
import { getUuid, UUID_Designator} from './ble-uuid';
import { CurrentWiFiCharacteristicUUID, CurrentWiFiCharacteristic} from './current-wifi-characteristic';
import { DeviceInfoCharacteristicUUID, DeviceInfoCharacteristic} from './device-info-characteristic';

const DeviceServiceUUID = 0xfff1;

const DeviceOptions = {
  filters: [
    {
      namePrefix: 'itemper',
    },
  ],
  optionalServices: [DeviceServiceUUID],
};
export interface BtCharacteristics {
  device: DeviceInfoCharacteristic;
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
      try {
        const btDevice = await this.pairDevice();
        this.onChanged(BtStatus.Connecting);
        const service = await this.getService(btDevice);
        const device = await this.getDeviceInfo(service);
        const current = await this.getCurrentWiFi(service);
        const available = await this.getAvailableWiFi(service);
        this.onChanged(BtStatus.Connected);
        log.info('bluetooth-service.getCharacteristics all itemper services connected');
        this.btDevice = btDevice;
        return { device, current, available };

      } catch (e) {
        log.error('bluetooth-service.getCharacteristics: ' + e);
        throw Error('Cannot get Bluetooth characteristics');
      }
  }
  public get name() {
    if (this.btDevice) {
      if (this.btDevice.name) {
        return this.btDevice.name;
      } else {
        return this.btDevice.id;
      }
    } else {
      return '';
    }
  }
  // disconnect from peripheral
  public disconnect() {
    this.onChanged(BtStatus.Disconnecting);
    if (this.btDevice && this.btDevice.gatt && this.btDevice.gatt.connected) {
        this.btDevice.gatt.disconnect();
    } else {
      log.info('bluetooth-service.disconnect: not connected');
      this.onChanged(BtStatus.Disconnected);
    }
  }
  private onDisconnected() {
    this.onChanged(BtStatus.Disconnected);
    log.info('bluetooth-service.onDisconnected');
  }
  private isPaired() {
    return this.btDevice && this.btDevice.gatt;
  }
  private async pairDevice(): Promise<BluetoothDevice> {
    try {
        const btDevice =  await navigator.bluetooth.requestDevice(DeviceOptions);
        btDevice.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
        log.info('bluetooth-service.getCharacteristics: successfully paired device ' + btDevice.name);
        return btDevice;
      } catch (e) {
        log.error('bluetooth-service.pairDevice: ' + e);
        throw new Error ('Cannot pair bluetooth device');
    }
  }
  // request connection to a device remote GATT service
  private async getService(btDevice: BluetoothDevice): Promise<BluetoothRemoteGATTService> {
    return new Promise((resolve, reject) => {
      if (btDevice.gatt) {
        log.info('bluetooth-service.connect: connecting to GATT server, connected=' + btDevice.gatt.connected);
        btDevice.gatt.connect()
        .then((server) => {
          log.info('bluetooth-service.connect: GATT server connected=' + server.connected);
          return server.getPrimaryService(DeviceServiceUUID);
        })
        .then((service) => {
            log.info('bluetooth-service.connect: connected to GATT service');
            resolve(service);
          })
        .catch(() => reject('Cannot get primary service'));
      } else {
        reject('No GATT server found');
      }
    });
  }
  private async getDeviceInfo(service: BluetoothRemoteGATTService): Promise<DeviceInfoCharacteristic> {
    try {
      const characteristic = await service.getCharacteristic(DeviceInfoCharacteristicUUID);
      return new DeviceInfoCharacteristic(characteristic);
    } catch {
      throw new Error ('Cannot get device info characteristics');
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
        await delay(1000 * Math.pow(2, retries));
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
