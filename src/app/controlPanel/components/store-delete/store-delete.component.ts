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
import Swal from "sweetalert2";

@Component({
  selector: 'app-store-delete',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIcon],
  templateUrl: './store-delete.component.html',
  styleUrls: ['./store-delete.component.css']
})

export class StoreDeleteComponent implements OnInit{

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


  @ViewChild('formDeleteStore') formDeleteStore!: ElementRef<HTMLFormElement>;
  @ViewChild(GraphicCreateComponent) graphicCreateComponent!: GraphicCreateComponent;

  constructor(
    private graphicService: GraphicService
  ) {
    this.storeData = new Store({})
    this.sensorData = new Sensor({})
    this.waste = new Waste({})
  }

  storeSelected = "";


  /**
   * Initial call to entities
   * */
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

  /**
   * Interaction with html form
   * */
  getStoreNameFromFthr(){
    let form = this.formDeleteStore.nativeElement;
    form.classList.toggle('return-to-hide');
    form.classList.toggle('bring-to-front');
  }

  cancelDeleteSensor(){
    let form = this.formDeleteStore.nativeElement;
    form.classList.toggle('bring-to-front');
    form.classList.toggle('return-to-hide');
  };

  /**
   * Get all sensor data from a store
   * */
  getSensorData(){
    this.sensorAux = []
    let storeAux = this.storesSource.filter(store => store.name == this.storeSelected);

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



  /**
   * Delete a Store together its sensors and wastes
   * */
  deleteStore(){
    let form = this.formDeleteStore.nativeElement;
    let ejectFunction = false;
    let storeAux: Store;
    const numStore = document.getElementById('num-store') as HTMLInputElement;

    /**
     * Search a existence store
     * */
    this.storesSource.find(s=> {
      if ((s.numberStore).toString() === numStore.value.trim()){
        ejectFunction = true;
        storeAux = s;
      }
    })


    /**
     * Ask if the user is sure of delete the store
     * */
    if (ejectFunction){
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.storeSelected = storeAux.name;
          if(storeAux.amountSensor > 0 && storeAux.sensorIds.length > 0){
            this.getSensorData();

            this.sensorAux.forEach(sa=> {
              this.sensorService.deleteSensor(sa.id).subscribe();
            })

            this.sensorAux.forEach(sasc => {
              sasc.wastesId.forEach(waste => {
                this.wastesSource.forEach(wasteAux => {
                  if (wasteAux.id === waste){
                    this.wasteService.delete(wasteAux.id).subscribe((response: Waste) => {
                      console.log(response)
                    })
                  }
                })
              })
            })
          }

          this.storeService.deleteStore(storeAux.id).subscribe();

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });

          numStore.value = "";
          form.classList.toggle('bring-to-front');
          form.classList.toggle('return-to-hide');
        }
      });
    }else{
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      })

      Toast.fire({
        icon: "error",
        title: "This Store / Zone doesn't exist",
      });
      numStore.value = "";
    }

  }



  /**
   *Get All from Api REST
   */
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
