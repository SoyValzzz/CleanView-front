import { Injectable } from '@angular/core';
import { ActivityService } from '../../activities/services/activity.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityFacadeService {
  constructor(private readonly activityService: ActivityService) {}

  getActivityByUserId(userId: number) {
    return this.activityService.getActivityByUserId(userId);
  }
}
