export class Activity {
  public readonly id: number;
  public readonly userId: number;
  public readonly description: string;
  public readonly points: number;
  public readonly date: string;

  constructor(
    public params: {
      id: number;
      userId: number;
      description: string;
      points: number;
      date: string;
    }
  ) {
    this.id = params.id;
    this.userId = params.userId;
    this.description = params.description;
    this.points = params.points;
    this.date = params.date;
  }
}
