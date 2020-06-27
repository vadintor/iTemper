import * as characteristics from './bluetooth-characteristics';
import * as services from './bluetoothservices';

import { log } from '@/services/logger';
export class WebBluetooth {

  private device: any = undefined;
  private cpuVendor: any = undefined;
  private cpuSpeed: any = undefined;

  constructor() {
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  /* the Device characteristic providing CPU information */
  public async setDeviceCharacteristic() {
    const service = await this.device.gatt.getPrimaryService(services.DeviceInfoServiceUIID);
    const vendor = await service.getCharacteristic(
      characteristics.CPUManufacturerCharacteristicUUID,
    );
    this.cpuVendor = vendor;

    const speed = await service.getCharacteristic(
      characteristics.CPUSpeedCharacteristicUUID,
    );
    this.cpuSpeed = speed;
  }

  /* request connection to a device */
  public async request() {
    const options = {
      filters: [
        {
          name: 'itemperBLE',
        },
      ],
      optionalServices: [services.DeviceInfoServiceUIID],
    };
    if (navigator.bluetooth === undefined) {
      alert('Sorry, Your device does not support Web BLE!');
      return;
    } else {
      this.device = await navigator.bluetooth.requestDevice(options);
    }

    if (!this.device) {
      throw new Error('No device selected');
    }
    this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
  }

  /* connect to device */
  public async connect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    await this.device.gatt.connect();
  }

  /* read CPU manufacturer */
  public async readCPUVendor() {
    const vendor = await this.cpuVendor.readValue();
    return decode(vendor);
  }

  /* read CPU speed */
  public async readCPUSpeed() {
    const speed = await this.cpuSpeed.readValue();
    return decode(speed);
  }

  /* disconnect from peripheral */
  public disconnect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    return this.device.gatt.disconnect();
  }

  /* handler to run when device successfully disconnects */
  public onDisconnected() {
    alert('Device is disconnected.');
    location.reload();
  }
}

/* helper function to decode message sent from peripheral */
export function decode(buf: any) {
  const dec = new TextDecoder('utf-8');
  return dec.decode(buf);
}







