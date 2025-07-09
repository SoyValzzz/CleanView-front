import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Code } from '../model/code.entity';
import { map, Observable } from 'rxjs';
import { CodeAssembler } from './code.assembler';

@Injectable({
  providedIn: 'root',
})
export class CodeService extends BaseService<Code> {
  constructor() {
    super();
    this.resourceEndPoint = '/codes';
  }

  getCodes(): Observable<Code[]> {
    return this.getAll().pipe(
      map((code) => CodeAssembler.toEntitiesFromResponse(code))
    );
  }
}
