export class Store {
  id = 0;
  sensorIds :number[];
  name = "";
  numberStore = 0;
  amountSensor = 0;
  fillPercent = "";
  color = "";
  ubication = "";

  constructor(store: {
    id ?: number,
    sensorIds ?: number[],
    name ?: string,
    numberStore ?: number,
    amountSensor ?: number,
    fillPercent ?: string,
    color ?: string,
    ubication ?: string,
  }) {
    this.id = store.id || 0;
    this.name = store.name || "";
    this.numberStore = store.numberStore || 0;
    this.amountSensor = store.amountSensor || 0;
    this.fillPercent = store.fillPercent || "";
    this.sensorIds = store.sensorIds ? store.sensorIds : [] || null;
    this.color = store.color || "";
    this.ubication = store.ubication || "";
  }
}
