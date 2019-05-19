import { IDevice } from "./IDevice";

export { IDevice };

export function getDeviceId(device: number | IDevice): number {
    return typeof device === "number" ? device : device.id;
}
