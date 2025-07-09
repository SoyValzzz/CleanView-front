import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Reward } from '../model/reward.entity';
import { map, Observable } from 'rxjs';
import { RewardAssembler } from './reward.assembler';

@Injectable({
  providedIn: 'root',
})
export class RewardService extends BaseService<Reward> {
  constructor() {
    super();
    this.resourceEndPoint = '/rewards';
  }

  getRewards(): Observable<Reward[]> {
    return this.getAll().pipe(
      map((reward) => RewardAssembler.toEntitiesFromResponse(reward))
    );
  }
}
