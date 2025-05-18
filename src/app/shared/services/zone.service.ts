import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../../controlPanel/model/Store.entity';

@Injectable({ providedIn: 'root' })
export class ZoneService {
  private apiUrl = 'https://my-json-server.typicode.com/SoyValzzz/db.clean/zones';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl);
  }

  addZone(zone: Store): Observable<Store> {
    return this.http.post<Store>(this.apiUrl, zone);
  }

  deleteZone(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateZone(id: string, updatedZone: Store): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${id}`, updatedZone);
  }
} 
