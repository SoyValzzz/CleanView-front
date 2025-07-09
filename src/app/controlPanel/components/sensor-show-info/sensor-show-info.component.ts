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

@Component({
  selector: 'app-sensor-show-info',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIcon],
  templateUrl: './sensor-show-info.component.html',
  styleUrls: ['./sensor-show-info.component.css']
})


export class SensorShowInfoComponent implements OnInit{
  protected storeData !: Store;
  protected sensorData !: Sensor;
  protected waste !: Waste;

  protected storesSource: Store[] = [];
  protected sensorsSource: Sensor[] = [];
  protected wastesSource: Waste[] = [];

  protected sensorsAux: Sensor[] = [];

  private storeService = inject(ZoneApiService);
  private sensorService = inject(SensorApiService);
  private wasteService = inject(WasteApiService);

  @ViewChild('listTableSensors') listTableSensors!: ElementRef<HTMLFormElement>;
  @ViewChild(GraphicCreateComponent) graphicCreateComponent!: GraphicCreateComponent;
  @ViewChild('sensorContainer') sensorContainer!: ElementRef;

  constructor() {
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

  }

  getStoreNameFromFthr(e: string){
    let form = this.listTableSensors.nativeElement;
    form.classList.toggle('return-to-hide');
    form.classList.toggle('bring-to-front');
    this.sensorSelected = e;
    this.getSensorData();
  }

  cancelInfoSensor(){
    let form = this.listTableSensors.nativeElement;
    form.classList.toggle('bring-to-front');
    form.classList.toggle('return-to-hide');
  };


  ////////////////////////////////////////////////////////////////////////////////////

  getSensorData(){
    const result: Sensor[] = [];

    let storeAux = this.storesSource.filter(store => store.name == this.sensorSelected);

    storeAux.forEach(store => {
      store.sensorIds.forEach(sensorId => {
        const foundSensor = this.sensorsSource.find(s => s.id === sensorId);
        if (foundSensor) {
          result.push(foundSensor);
        }
      });
    });

    this.sensorsAux = result;
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

  private getAllWastes() {
    this.wasteService.getAll().subscribe((wastes: Array<Waste>) => {
      this.wastesSource = wastes;
    });
  }
}
