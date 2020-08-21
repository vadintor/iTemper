import { log } from '@/services/logger';
import * as ble from './bluetooth-service';
import { WiFiNetwork } from '@/features/devices/device-data';
import { isWiFiDataValid, isWiFiDataArrayValid } from '@/features/devices/device-data-validators';
import { networkInterfaces } from 'os';

export const AvailableWiFiCharacteristicUUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84540';
type Listener = (network: WiFiNetwork) => void;

export class AvailableWiFiCharacteristic {
  private characteristic: BluetoothRemoteGATTCharacteristic;
  private listener: Listener | undefined;

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
            const networks = data as WiFiNetwork[];
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

  public subscribe(listener: Listener): void {
    log.debug('available-wifi-characteristics.readValue');
    this.listener = listener;
    this.characteristic.startNotifications().then((characteristic) => {
        characteristic.addEventListener('characteristicvaluechanged', this.handleNotifications.bind(this));
    });
  }
  public unsubscribe(): void {
    this.characteristic.stopNotifications().then(() => this.listener = undefined);
  }
  private handleNotifications(ev: any): void {
    const str = ble.decode(ev.target.value);
    log.info('available-wifi-characteristics.handleNotifications ' + str);
    try {
      const data = JSON.parse(str);
      if (isWiFiDataValid(data)) {
        const networks = data as WiFiNetwork;
        if (this.listener) {
          this.listener(data);
        }
      }
    } catch {
      log.error('available-wifi-characteristics.handleNotifications, parse value ');
    }

  }
}
