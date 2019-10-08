import { DeviceService } from './device-service';
import { LoginService } from './login-service';
import { SensorService } from './sensor-service';

export const loginService = new LoginService();
export const deviceService = new DeviceService(loginService);
export const sensorService = new SensorService(loginService);
