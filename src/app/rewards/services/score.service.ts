import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Score } from '../model/score.entity';
import { map, Observable } from 'rxjs';
import { ScoreAssembler } from './score.assembler';

@Injectable({
  providedIn: 'root',
})
export class ScoreService extends BaseService<Score> {
  constructor() {
    super();
    this.resourceEndPoint = '/scores';
  }

  getScores(): Observable<Score[]> {
    return this.getAll().pipe(
      map((score) => ScoreAssembler.toEntitiesFromResponse(score))
    );
  }

  getScoreByUserId(userId: number): Observable<Score> {
    return this.getByQuery({ userId }).pipe(
      map((score) => ScoreAssembler.toEntitiesFromResponse(score)[0])
    );
  }

  updateScoreByUserId(userId: number, score: Score): Observable<Score> {
    return this.updateByQuery({ userId }, score).pipe(
      map((updatedScore) => ScoreAssembler.toEntityFromResource(updatedScore[0]))
    );
  }
}
