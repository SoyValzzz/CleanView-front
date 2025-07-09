import { Code } from '../model/code.entity';
import { CodeService } from './code.service';
import { CodeResource, TopHeadlinesResponse } from './top-headliness.response';

export class CodeAssembler {
  static scoreService: CodeService;
  static withCodeService(scoreService: CodeService) {
    this.scoreService = scoreService;
    return this;
  }
  static toEntityFromResource(resource: CodeResource): Code {
    return new Code(resource);
  }

  static toEntitiesFromResponse(
    response: TopHeadlinesResponse<CodeResource>
  ): Code[] {
    return response.map((score) => this.toEntityFromResource(score));
  }
}
