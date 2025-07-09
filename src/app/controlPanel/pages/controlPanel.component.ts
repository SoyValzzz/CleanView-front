import {AfterViewInit, Component, ElementRef, ViewChild, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {GraphicCreateComponent} from "../components/graphic-create/graphic-create.component";
import {SensorCreateAndEditComponent} from "../components/sensor-create-and-edit/sensor-create-and-edit.component";
import {ZoneCreateComponent} from "../components/zone-create/zone-create.component";
import {Store} from "../model/store.entity";
import {Sensor} from "../model/sensor.entity";
import {Waste} from "../model/waste.entity";
import {ZoneApiService} from "../services/zone-api.service";
import {SensorApiService} from "../services/sensor-api.service";
import {WasteApiService} from "../services/waste-api.service";
import {SensorShowInfoComponent} from "../components/sensor-show-info/sensor-show-info.component";
import {SensorDeleteComponent} from "../components/sensor-delete/sensor-delete.component";
import {MatIcon} from "@angular/material/icon";
import {StoreDeleteComponent} from "../components/store-delete/store-delete.component";
import {AuthService} from "../../users/services/auth.service";

@Component({
  selector: 'app-controlPanel',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    GraphicCreateComponent,
    SensorCreateAndEditComponent,
    ZoneCreateComponent,
    SensorShowInfoComponent,
    SensorDeleteComponent,
    MatIcon,
    StoreDeleteComponent,
  ],
  templateUrl: './controlPanel.component.html',
  styleUrls: ['./controlPanel.component.css']
})

// @Autor: Gabriel Gordon
// This component works with the manage of all the waste that company generate

export class ControlPanelComponent implements AfterViewInit, OnInit{
  name = 'controlPanel';

  currentUserId: number | null = null;

  @ViewChild(SensorCreateAndEditComponent) sensorCreateAndEditComponent!: SensorCreateAndEditComponent;
  @ViewChild(SensorShowInfoComponent) sensorShowInfoComponent!: SensorShowInfoComponent;
  @ViewChild(SensorDeleteComponent) sensorDeleteComponent!: SensorDeleteComponent;
  @ViewChild(ZoneCreateComponent) zoneCreateComponent!: ZoneCreateComponent;
  @ViewChild(StoreDeleteComponent) storeDeleteComponent!: StoreDeleteComponent;

  protected storeData !: Store;
  protected sensorData !: Sensor;
  protected waste !: Waste;

  protected storesSource: Store[] = [];
  protected sensorsSource: Sensor[] = [];
  protected wastesSource: Waste[] = [];

  private storeService = inject(ZoneApiService);
  private sensorService = inject(SensorApiService);
  private wasteService = inject(WasteApiService);

  constructor(private authService: AuthService) {
    this.storeData = new Store({})
    this.sensorData = new Sensor({})
    this.waste = new Waste({})
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.currentUserId = this.authService.currentUserValue?.id || null;
    this.storeService.stores$.subscribe(stores => {
      this.storesSource = stores;
    });
    this.getAllSensors();
    this.getAllWastes();
  }

  addNewSensor( e: string){
    this.sensorCreateAndEditComponent.getStoreNameFromFthr(e);
  };

  showInfoSensor(e: string){
    this.sensorShowInfoComponent.getStoreNameFromFthr(e);
  };

  deleteSensor(e: string){
    this.sensorDeleteComponent.getStoreNameFromFthr(e);
  }

  deleteStore(){
    this.storeDeleteComponent.getStoreNameFromFthr();
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

