import {BaseService} from "../../shared/services/base.service";
import {environment} from "../../../environments/environment";
import {Waste} from "../model/waste.entity";
import {Injectable} from "@angular/core";
import {BehaviorSubject, observable, Observable} from "rxjs";

const wasteEndPointPath = environment.wasteEndPointPath;

@Injectable({
  providedIn: 'root'
})

export class WasteApiService extends BaseService<Waste>{
  private wasteSubject = new BehaviorSubject<Waste[]>([]);
  waste$ = this.wasteSubject.asObservable();

  constructor() {
    super();
    this.serviceBaseUrl = environment.apiBaseUrl;
    this.resourceEndPoint = wasteEndPointPath;
  }

  loadWastes(){
    this.getAll().subscribe({
      next: (wastes: Waste[]) =>{
        this.wasteSubject.next(wastes);
      },
      error: (err) => {
        console.log("Error loading wastes", err);
      }
    })
  }


  createWaste(waste: Waste){
    return new Observable<Waste>(observer => {
      this.create(waste).subscribe({
        next: (newWaste: Waste) =>{
          const currentWastes = this.wasteSubject.value;
          this.wasteSubject.next([...currentWastes,newWaste]);
          observer.next(newWaste);
          observer.complete();
        },
        error: (err) => observer.error(err)
      })
    })
  }

}
