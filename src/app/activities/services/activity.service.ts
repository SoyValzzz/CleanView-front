import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Activity } from '../model/activity.entity';
import { map, Observable } from 'rxjs';
import { ActivityAssembler } from './activity.assembler';

@Injectable({
  providedIn: 'root',
})
export class ActivityService extends BaseService<Activity> {
  constructor() {
    super();
    this.resourceEndPoint = '/activities';
  }

  getActivities(): Observable<Activity[]> {
    return this.getAll().pipe(
      map((activities) => ActivityAssembler.toEntitiesFromResponse(activities))
    );
  }

  getActivityByUserId(userId: number): Observable<Activity[]> {
    return this.getByQuery({ userId }).pipe(
      map((activities) => ActivityAssembler.toEntitiesFromResponse(activities))
    );
  }
}
