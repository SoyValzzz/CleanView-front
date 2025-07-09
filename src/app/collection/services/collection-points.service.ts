import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollectionPoint } from '../model/collection-points.entity';

@Injectable({
  providedIn: 'root'
})
export class CollectionPointsService {

  private apiUrl = 'https://backend-web-applications-production-0747.up.railway.app/api/v1/collection-points';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CollectionPoint[]> {
    return this.http.get<CollectionPoint[]>(this.apiUrl);
  }

  addCollectionPoint(newPoint: CollectionPoint): Observable<CollectionPoint> {
    return this.http.post<CollectionPoint>(this.apiUrl, newPoint);
  }

  deleteCollectionPoint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCollectionPoint(id: string, updatedPoint: CollectionPoint): Observable<CollectionPoint> {
    return this.http.put<CollectionPoint>(`${this.apiUrl}/${id}`, updatedPoint);
  }
}
