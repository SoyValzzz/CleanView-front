export class Sensor {
  id = 0;
  wastesId: number[] = [];
  serialNumber = "";
  location = "";
  battery = 0;
  units = "";
  capacity = "";
  currentCapacity = "";
  percentage = "";
  collection = "";

  constructor(sensor: {
    id ?: number,
    wastesId ?: number[],
    serialNumber ?: string,
    location ?: string,
    battery ?: number,
    units ?: string,
    capacity?: string,
    currentCapacity?: string,
    percentage?: string,
    collection?: string
  }) {
    this.id = sensor.id || 0;
    this.wastesId = sensor.wastesId ? sensor.wastesId : [] || null;
    this.serialNumber = sensor.serialNumber || "";
    this.location = sensor.location || "";
    this.battery = sensor.battery || 0;
    this.units = sensor.units || "";
    this.capacity = sensor.capacity || "";
    this.currentCapacity = sensor.currentCapacity || "";
    this.percentage = sensor.percentage || "";
    this.collection = sensor.collection || "";
  }
}
