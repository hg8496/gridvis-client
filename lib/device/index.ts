import { IDevice } from "./IDevice";

export { IDevice };
export { IConnectionTest } from "./IConnectionTest";
export { DevicesEndpoint } from "./DevicesEndpoint";

export function getDeviceId(device: number | IDevice): number {
    return typeof device === "number" ? device : device.id;
}
