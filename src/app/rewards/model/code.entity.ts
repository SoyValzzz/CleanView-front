export class Code {
  public readonly id: number;
  public readonly rewardId: number;
  public readonly code: string;
  public readonly isRedeemed: boolean;
  public readonly createdAt: string;
  public readonly expiresAt: string;
  public readonly userId: number | null;

  constructor(
    public params: {
      id: number;
      rewardId: number;
      code: string;
      isRedeemed: boolean;
      createdAt: string;
      expiresAt: string;
      userId: number | null;
    }
  ) {
    this.id = params.id;
    this.rewardId = params.rewardId;
    this.code = params.code;
    this.isRedeemed = params.isRedeemed;
    this.createdAt = params.createdAt;
    this.expiresAt = params.expiresAt;
    this.userId = params.userId;
  }
}
