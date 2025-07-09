import {BaseService} from "../../shared/services/base.service";
import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {Sensor} from "../model/sensor.entity";
import {BehaviorSubject, map, Observable, tap} from "rxjs";

const sensorEndPointPath = environment.sensorEndPointPath;

@Injectable({
  providedIn: 'root'
})

export class SensorApiService extends BaseService<Sensor>{

  private sensorSubject = new BehaviorSubject<Sensor[]>([]);
  sensor$ = this.sensorSubject.asObservable();

  constructor() {
    super();
    this.serviceBaseUrl = environment.apiBaseUrl;
    this.resourceEndPoint = sensorEndPointPath;
    this.loadSensors();
  }

  loadSensors() {
    this.getAll().subscribe({
      next: (sensors: Sensor[]) => {
        this.sensorSubject.next(sensors);
      },
      error: (err) => {
        console.error('Error loading sensors', err);
      }
    });
  }

  createSensor(sensor: Sensor) {
    return new Observable<Sensor>(observer => {
      this.create(sensor).subscribe({
        next: (newSensor: Sensor) => {
          const currentSensors = this.sensorSubject.value;
          this.sensorSubject.next([...currentSensors, newSensor]);
          observer.next(newSensor);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    })
  }

  deleteSensor(id: number): Observable<void> {
    return this.delete(id).pipe(
      tap(() => {
        const updatedList = this.sensorSubject.value.filter(s => s.id !== id);
        this.sensorSubject.next(updatedList);
      }),
      map(() => void 0)
    );
  }

  updateSensorLocally(updatedSensor: Sensor) {
    const currentSensors = this.sensorSubject.getValue();
    const index = currentSensors.findIndex(store => store.id === updatedSensor.id);
    if (index !== -1) {
      currentSensors[index] = updatedSensor;
    } else {
      currentSensors.push(updatedSensor);
    }
    this.sensorSubject.next([...currentSensors]);
  }

  setInitialSensors(sensors: Sensor[]) {
    this.sensorSubject.next(sensors);
  }
}
