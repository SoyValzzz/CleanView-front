export class Action {
  id: number;
  title: string;
  description: string;
  type: string;
  favorite: boolean;
  creatorUserId?: number;

  constructor(init?: Partial<Action>) {
    this.id = init?.id ?? 0;
    this.title = init?.title ?? '';
    this.description = init?.description ?? '';
    this.type = init?.type ?? '';
    this.favorite = init?.favorite ?? false;
    this.creatorUserId = init?.creatorUserId;
  }
}
