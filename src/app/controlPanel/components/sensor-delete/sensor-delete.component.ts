import {Component, ElementRef, inject, OnInit, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatIcon} from "@angular/material/icon";
import {Store} from "../../model/store.entity";
import {Sensor} from "../../model/sensor.entity";
import {Waste} from "../../model/waste.entity";
import {ZoneApiService} from "../../services/zone-api.service";
import {SensorApiService} from "../../services/sensor-api.service";
import {WasteApiService} from "../../services/waste-api.service";
import {GraphicCreateComponent} from "../graphic-create/graphic-create.component";
import {GraphicService} from "../../services/graphic.service";

@Component({
  selector: 'app-sensor-delete',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIcon],
  templateUrl: './sensor-delete.component.html',
  styleUrls: ['./sensor-delete.component.css']
})

export class SensorDeleteComponent implements OnInit{

  protected storeData !: Store;
  protected sensorData !: Sensor;
  protected waste !: Waste;

  protected storesSource: Store[] = [];
  protected sensorsSource: Sensor[] = [];
  protected wastesSource: Waste[] = [];

  protected sensorAux: Sensor[] = [];

  private storeService = inject(ZoneApiService);
  private sensorService = inject(SensorApiService);
  private wasteService = inject(WasteApiService);


  @ViewChild('formDeleteSensor') formDeleteSensor!: ElementRef<HTMLFormElement>;
  @ViewChild(GraphicCreateComponent) graphicCreateComponent!: GraphicCreateComponent;
  @ViewChild('sensorContainer') sensorContainer!: ElementRef;



  constructor(
    private graphicService: GraphicService
  ) {
    this.storeData = new Store({})
    this.sensorData = new Sensor({})
    this.waste = new Waste({})
  }

  sensorSelected = "";

  ngOnInit(){
    this.storeService.stores$.subscribe(stores => {
      this.storesSource = stores;
    });

    this.sensorService.sensor$.subscribe(sensors => {
      this.sensorsSource = sensors;
    });

    this.getAllWastes();

    this.sensorService.getAll().subscribe(sensors => {
      this.sensorService.setInitialSensors(sensors);
    })
  }

  getStoreNameFromFthr(e: string){
    let form = this.formDeleteSensor.nativeElement;
    form.classList.toggle('return-to-hide');
    form.classList.toggle('bring-to-front');
    this.sensorSelected = e;
    this.getSensorData();
  }

  cancelDeleteSensor(){
    let form = this.formDeleteSensor.nativeElement;
    form.classList.toggle('bring-to-front');
    form.classList.toggle('return-to-hide');
  };


  getSensorData(){
    this.sensorAux = []
    let storeAux = this.storesSource.filter(store => store.name == this.sensorSelected);

    storeAux.forEach(store => {
      console.log(store)
      store.sensorIds.forEach(sensor => {
        this.sensorsSource.forEach(sensorAux => {
          if (sensorAux.id === sensor){
            this.sensorAux.push(sensorAux)
          }
        })
      })
    });
  }

  deleteSensor(){
    let form = this.formDeleteSensor.nativeElement;
    const numSensor = document.getElementById('num-sensor') as HTMLInputElement;
    console.log(numSensor.value)

    this.storesSource.forEach(store => {
      if (store.name == this.sensorSelected){
        store.sensorIds.forEach(sensor => {
          this.sensorsSource.forEach(sensorAux => {
            if ( sensorAux.id === sensor && (sensorAux.serialNumber).toString() === numSensor.value ){
              let answ= prompt("Are you sure you want to delete this sensor? y/n", "n")
              if (answ === "y"){

                //delete Sensor
                this.sensorService.deleteSensor(sensorAux.id).subscribe()


                //delete Sensor from store
                store.amountSensor--;
                store.sensorIds.splice(store.sensorIds.indexOf(sensor), 1);

                this.storeService.update(store.id, store).subscribe((response: Store) => {
                  this.storeService.updateStoreLocally(store);
                })

                //delete waste from Sensor
                sensorAux.wastesId.forEach(waste => {
                  this.wastesSource.forEach(wasteAux => {
                    if (wasteAux.id === waste){
                      this.wasteService.delete(wasteAux.id).subscribe((response: Waste) => {
                        console.log(response)
                      })
                    }
                  })
                })
              }
            }
          })
        })
      }
    })
    form.classList.toggle('return-to-hide');
    numSensor.value = '';
  }


  // Behavior of list
  scrollNext() {
    const container = this.sensorContainer.nativeElement;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  scrollPrev() {
    const container = this.sensorContainer.nativeElement;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  // Get all from api

  private getAllSensors() {
    this.sensorService.getAll().subscribe((sensors: Array<Sensor>) => {
      this.sensorsSource = sensors;
    });
  }

  private getAllWastes() {
    this.wasteService.getAll().subscribe((wastes: Array<Waste>) => {
      this.wastesSource = wastes;
    });
  }
}
