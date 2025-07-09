import { Injectable } from '@angular/core';
import { Store } from '../model/store.entity';
import {BaseService} from "../../shared/services/base.service";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map, Observable, tap} from 'rxjs';

const zonesEndPointPath = environment.zoneEndPointPath;

@Injectable({
  providedIn: 'root'
})

export class ZoneApiService extends BaseService<Store>{
  private storesSubject = new BehaviorSubject<Store[]>([]);
  stores$ = this.storesSubject.asObservable();

  constructor() {
    super();
    this.serviceBaseUrl = environment.apiBaseUrl;
    this.resourceEndPoint = zonesEndPointPath;
  }

  loadStores() {
    this.getAll().subscribe({
      next: (stores: Store[]) => {
        this.storesSubject.next(stores);
      },
      error: (err) => {
        console.error('Error loading stores', err);
      }
    });
  }

  createStore(store: Store) {
    return new Observable<Store>(observer => {
      this.create(store).subscribe({
        next: (newStore: Store) => {
          const currentStores = this.storesSubject.value;
          this.storesSubject.next([...currentStores, newStore]);
          observer.next(newStore);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getAllS(): Observable<Store[]> {
    return this.stores$;
  }

  updateStoreLocally(updatedStore: Store) {
    const currentStores = this.storesSubject.getValue();
    const index = currentStores.findIndex(store => store.id === updatedStore.id);
    if (index !== -1) {
      currentStores[index] = updatedStore;
    } else {
      currentStores.push(updatedStore);
    }
    this.storesSubject.next([...currentStores]);
  }

  setInitialStores(stores: Store[]) {
    this.storesSubject.next(stores);
  }

  deleteStore(id: number){
    return this.delete(id).pipe(
      tap(() => {
        const updatedList = this.storesSubject.value.filter(s => s.id !== id);
        this.storesSubject.next(updatedList)
      }),
      map(() => void 0)
    );
  }

}
