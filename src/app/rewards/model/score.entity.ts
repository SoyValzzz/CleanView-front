export class Score {
  public readonly id: number;
  public readonly userId: number;
  public readonly points: number;
  public readonly lastUpdated: string;

  constructor(
    public params: {
      id: number;
      userId: number;
      points: number;
      lastUpdated: string;
    }
  ) {
    this.id = params.id;
    this.userId = params.userId;
    this.points = params.points;
    this.lastUpdated = params.lastUpdated;
  }
}
