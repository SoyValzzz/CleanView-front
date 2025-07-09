import { Reward } from '../model/reward.entity';
import { RewardService } from './reward.service';
import {
  RewardResource,
  TopHeadlinesResponse,
} from './top-headliness.response';

export class RewardAssembler {
  static rewardService: RewardService;
  static withLogoApiService(rewardService: RewardService) {
    this.rewardService = rewardService;
    return this;
  }
  static toEntityFromResource(resource: RewardResource): Reward {
    return new Reward(resource);
  }

  static toEntitiesFromResponse(response: TopHeadlinesResponse): Reward[] {
    return response.map((reward) => this.toEntityFromResource(reward));
  }
}
