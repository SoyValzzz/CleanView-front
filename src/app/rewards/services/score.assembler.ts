import { Score } from '../model/score.entity';
import { ScoreService } from './score.service';
import { ScoreResource, TopHeadlinesResponse } from './top-headliness.response';

export class ScoreAssembler {
  static scoreService: ScoreService;
  static withScoreService(scoreService: ScoreService) {
    this.scoreService = scoreService;
    return this;
  }
  static toEntityFromResource(resource: ScoreResource): Score {
    return new Score(resource);
  }

  static toEntitiesFromResponse(
    response: TopHeadlinesResponse<ScoreResource>
  ): Score[] {
    return response.map((score) => this.toEntityFromResource(score));
  }
}
