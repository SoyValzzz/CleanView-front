export class Reward {
  public readonly id: number;
  public readonly discount: string;
  public readonly description: string;
  public readonly pointsRequired: number;
  public readonly imageUrl: string;
  public readonly codesAvailable: number = 0;

  constructor(
    public params: {
      id: number;
      discount: string;
      description: string;
      pointsRequired: number;
      imageUrl: string;
      codesAvailable: number;
    }
  ) {
    this.id = params.id;
    this.discount = params.discount;
    this.description = params.description;
    this.pointsRequired = params.pointsRequired;
    this.imageUrl = params.imageUrl;
    this.codesAvailable = params.codesAvailable;
  }
}
