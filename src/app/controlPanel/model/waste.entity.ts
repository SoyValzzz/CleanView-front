export class Waste {
  id = 0;
  name = "";
  type = "";
  amount = 0;

  constructor(waste: { id ?: number, name ?: string, type ?: string, amount ?: number}) {
    this.id = waste.id || 0;
    this.name = waste.name || "";
    this.type = waste.type || "";
    this.amount = waste.amount || 0;
  }
}
