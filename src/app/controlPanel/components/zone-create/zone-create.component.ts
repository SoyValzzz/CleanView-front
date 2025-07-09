import {Component, ElementRef, ViewChild, Output, EventEmitter, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {MatIcon} from "@angular/material/icon";
import Swal from 'sweetalert2'
import {Store} from "../../model/store.entity";
import {Sensor} from "../../model/sensor.entity";
import {Waste} from "../../model/waste.entity";
import {ZoneApiService} from "../../services/zone-api.service";
import {SensorApiService} from "../../services/sensor-api.service";
import {WasteApiService} from "../../services/waste-api.service";
import {GraphicService} from "../../services/graphic.service";

@Component({
  selector: 'app-zone-create',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIcon],
  templateUrl: './zone-create.component.html',
  styleUrls: ['./zone-create.component.css']
})

// @Autor: Gabriel Gordon

export class ZoneCreateComponent implements OnInit {
  name = 'zone-create';

  @Output() zoneAdded = new EventEmitter<void>();
  @Output() createGraphic = new EventEmitter<void>();

  protected storeData !: Store;
  protected sensorData !: Sensor;
  protected waste !: Waste;

  protected storesSource: Store[] = [];
  protected sensorsSource: Sensor[] = [];
  protected wastesSource: Waste[] = [];

  private storeService = inject(ZoneApiService);
  private sensorService = inject(SensorApiService);
  private wasteService = inject(WasteApiService);

  numberOfStore = 0;

  constructor(
    private graphicService: GraphicService

  ) {
    this.storeData = new Store({})
    this.sensorData = new Sensor({})
    this.waste = new Waste({})
  }

  @ViewChild('formAddZone') formAddZoneRef!: ElementRef<HTMLFormElement>;

  ngOnInit() {
    this.getAllStores();
    this.getAllSensors();
    this.getAllWastes();
  }

  addNewZone(){
    let form = this.formAddZoneRef.nativeElement;
    form.classList.toggle('return-to-hide');
    form.classList.toggle('bring-to-front');
  };
  cancelAddNewZone(){
    let form = this.formAddZoneRef.nativeElement;
    form.classList.toggle('bring-to-front');
    form.classList.toggle('return-to-hide');
  };

  //Store, GRAPHIC AND SENSOR LOGIC
  //register the store on the page
  registerZone(){
    let form = this.formAddZoneRef.nativeElement;
    const nameZnInput = document.getElementById('nameZnInput') as HTMLInputElement;
    const ubicationZnInput = document.getElementById('ubicationZnInput') as HTMLInputElement;

    let zone = nameZnInput.value.trim();
    let ubicationZn = ubicationZnInput.value.trim();

    if (zone.length > 0 && ubicationZn.length > 0) {

      // add random features to entity
      let randCl = "#" + Math.floor(Math.random() * 16777215).toString(16);
      let id = Math.floor(Math.random() * 1423 + 1345);
      this.storesSource.forEach(ss => {
        while (id === ss.id){
          id++;
        }
      })
      let num = this.numberOfStore + 1;
      this.numberOfStore++;

      //create new class
      let newStore = new Store({
          id: id,
          sensorIds: [],
          name: zone,
          numberStore: num,
          amountSensor: 0,
          fillPercent: "0%",
          color: randCl,
          ubication: ubicationZn
        });

      // save to api
      this.storeService.createStore(newStore).subscribe({
        next: () => {
          nameZnInput.value = '';
          ubicationZnInput.value = '';
          form.classList.toggle('return-to-hide');
        },
      });
    }
    else{
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "No let empty fields"
      });
    }
  }

  async exportGraphic() {
    const { value: op } = await Swal.fire({
      title: "Select option of export",
      input: "select",
      inputOptions: {
        File: {
          pdf: "pdf",
          excel: "excel",
        },
        Image: {
          png: "png",
        }
      },
      inputPlaceholder: "Select an option",
      showCancelButton: true,
    });
    if (op) {
      Swal.fire(`Downloading: ${op}`);
      let exportType = op;

      if (op === "png")
        exportType = "image";

      this.graphicService.triggerExport(exportType)
    }

  }


  // Get all from api
  private getAllStores() {
    this.storeService.getAll().subscribe((stores: Array<Store>) => {
      this.storesSource = stores;
    });
  }

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

