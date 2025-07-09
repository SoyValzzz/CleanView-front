export class ActivityReward {
  public readonly id: number;
  public readonly points: number;
  public readonly description: string;

  constructor(
    public params: {
      id: number;
      points: number;
      description: string;
    }
  ) {
    this.id = params.id;
    this.points = params.points;
    this.description = params.description;
  }
}
