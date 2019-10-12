import { DeviceService } from './device-service';
import { ApiService } from './api-service';
import { SensorService } from './sensor-service';

export const loginService = new ApiService();
export const deviceService = new DeviceService(loginService);
export const sensorService = new SensorService(loginService);
