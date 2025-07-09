import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ExportType = 'image' | 'excel' | 'pdf';

@Injectable({ providedIn: 'root' })
export class GraphicService {

  private _redrawChart = new Subject<void>();
  redrawChart$ = this._redrawChart.asObservable();

  triggerRedraw() {
    this._redrawChart.next();
  }

  private _exportChart = new Subject<ExportType>();
  exportChart$ = this._exportChart.asObservable();

  triggerExport(type: ExportType) {
    this._exportChart.next(type);
  }
}
