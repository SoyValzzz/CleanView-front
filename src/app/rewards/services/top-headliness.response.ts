export type TopHeadlinesResponse<T = RewardResource> = T[];

export interface RewardResource {
  id: number;
  discount: string;
  description: string;
  pointsRequired: number;
  imageUrl: string;
  codesAvailable: number;
}

export interface ScoreResource {
  id: number;
  userId: number;
  points: number;
  lastUpdated: string;
}

export interface CodeResource {
  id: number;
  rewardId: number;
  code: string;
  isRedeemed: boolean;
  createdAt: string;
  expiresAt: string;
  userId: number | null;
}
