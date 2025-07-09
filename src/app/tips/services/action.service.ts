import { Injectable } from '@angular/core';
import { Action } from "../model/action.entity";
import { BaseService } from "../../shared/services/base.service";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionService extends BaseService<Action>{

  constructor() {
    super();
    this.serviceBaseUrl = environment.apiBaseUrl;
    this.resourceEndPoint = "/sustainable-actions";
  }
}
