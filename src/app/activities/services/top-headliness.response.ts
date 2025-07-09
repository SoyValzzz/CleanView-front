export type TopHeadlinesResponse = ActivityResource[];

export interface ActivityResource {
  id: number;
  userId: number;
  description: string;
  points: number;
  date: string;
}
