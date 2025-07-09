import { Activity } from '../model/activity.entity';

export interface ActivityResource {
  id: number;
  userId: number;
  description: string;
  points: number;
  date: string;
}

export interface ActivitiesResponse extends Array<ActivityResource> {}

export class ActivityAssembler {
  static toEntityFromResource(resource: ActivityResource): Activity {
    return new Activity(resource);
  }

  static toEntitiesFromResponse(response: ActivitiesResponse): Activity[] {
    return response.map((activity) => this.toEntityFromResource(activity));
  }
}
