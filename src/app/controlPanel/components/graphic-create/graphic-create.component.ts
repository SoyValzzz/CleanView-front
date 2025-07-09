import {AfterViewInit, Component, ElementRef, inject, NgModule, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import { MatOption, MatSelect} from "@angular/material/select";
import { Store } from '../../model/store.entity';
import { GraphicService } from '../../services/graphic.service';
import { FormsModule } from "@angular/forms";
import {Sensor} from "../../model/sensor.entity";
import {Waste} from "../../model/waste.entity";
import {ZoneApiService} from "../../services/zone-api.service";
import {SensorApiService} from "../../services/sensor-api.service";
import {WasteApiService} from "../../services/waste-api.service";
import {debounceTime, Subscription} from "rxjs";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import Chart, {ChartType} from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface Type {
  value: string;
  viewValue: string;
}

interface Time {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-graphic-create',
  standalone: true,
  imports: [FormsModule,CommonModule, TranslateModule, MatCard, MatCardHeader, MatCardContent, MatCardTitle, MatSelect, MatOption],
  templateUrl: './graphic-create.component.html',
  styleUrls: ['./graphic-create.component.css']
})

// @Autor: Gabriel Gordon


export class GraphicCreateComponent implements OnInit, AfterViewInit{
  name = 'graphic-create';

  currentStore: Store | null = null;
  selectedType: string = 'bar';
  selectedTime: string = '';

  threshold = 70;

  months = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonth = new Date().getMonth();


  protected storeData !: Store;
  protected sensorData !: Sensor;
  protected waste !: Waste;

  protected storesSource: Store[] = [];
  protected sensorsSource: Sensor[] = [];
  protected wastesSource: Waste[] = [];

  protected sensorsAuxSh: Sensor[] = [];
  protected storesAuxSh: Store[] = [];


  private storeService = inject(ZoneApiService);
  private sensorService = inject(SensorApiService);
  private wasteService = inject(WasteApiService);

  @ViewChild('wasteChart') canvasRef!: ElementRef<HTMLCanvasElement>;
  private subscription: Subscription;

  constructor(
    private graphicService: GraphicService,
  ) {
    this.storeData = new Store({})
    this.sensorData = new Sensor({})
    this.waste = new Waste({})

    this.subscription = this.graphicService.exportChart$.subscribe(type => {
      if (type === 'image') this.exportChart(type);
      if (type === 'excel') this.exportChartAsExcel();
      if (type === 'pdf') this.exportChart(type);
    });
  }

  ngOnInit(){
    this.graphicService.redrawChart$.subscribe(() => {
      this.buildGraphic();
    });

    this.storeService.stores$.subscribe(stores => {
      this.storesSource = stores;
      this.buildGraphic();
    });

    this.sensorService.sensor$.subscribe(sensors => {
      this.sensorsSource = sensors;
    });

    this.getAllWastes();

    this.storeService.getAll().subscribe(stores => {
      this.storeService.setInitialStores(stores);
    });
  }



  chart: Chart | undefined;

  types: Type[] = [
    {value: 'bar', viewValue: 'bar'},
    {value: 'line', viewValue: 'line'},
  ];

  times: Time[] = [
    {value: 'none', viewValue: 'none'},
    {value: 'monthly', viewValue: 'monthly'},
    {value: 'weekly', viewValue: 'weekly'},
    {value: 'annual', viewValue: 'annual'},
  ];



  exportChart(type: 'pdf' | 'image') {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.chart) return;

    const originalDatalabels = this.chart.options.plugins?.datalabels;

    if (!this.chart.options.plugins) this.chart.options.plugins = {};

    this.chart.options.plugins.datalabels = {
      anchor: 'end',
      align: 'start',
      offset: -18,
      color: type === 'image' ? '#fff' : '#000',
      font: { weight: 'bold' },
      formatter: (value: any) => value + ' kg'
    };

    this.chart?.update();


    setTimeout(() => {
      html2canvas(canvas).then((canvasImage) => {
        const imgData = canvasImage.toDataURL('image/png');

        if (type === 'pdf') {
          const pdf = new jsPDF('landscape');
          pdf.addImage(imgData, 'PNG', 10, 10, 200, 150);
          pdf.save('waste-chart.pdf');
        }

        if (type === 'image') {
          const link = document.createElement('a');
          link.href = imgData;
          link.download = 'waste-chart.png';
          link.click();
        }

        if (originalDatalabels) {
          this.chart!.options.plugins!.datalabels = originalDatalabels;
        } else {
          delete this.chart!.options.plugins!.datalabels;
        }

        this.chart!.update();
      });
    }, 500);
  }

  exportChartAsExcel() {
    if (!this.chart) return;

    const chartData = this.chart.data;
    const labels = chartData.labels as string[];
    const datasets = chartData.datasets;

    // build structures
    const excelData: any[] = [];

    // Month labels
    labels.forEach((label, index) => {
      const row: any = { Month: label };

      datasets.forEach(dataset => {
        const datasetLabel = dataset.label || `Dataset ${index}`;
        const data = dataset.data as number[];
        row[datasetLabel] = data[index];
      });

      excelData.push(row);
    });

    // build excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Waste Data');
    XLSX.writeFile(workbook, 'waste-data.xlsx');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }





  randomArrayNumber(){
    let array = [];
    for (let i = 0; i < this.months.length; i++) {
      array.push(Math.floor(Math.random() * 100));
    }
    return array;
  }



  generateData(length: number): number[] {
    return Array.from({ length }, () => Math.floor(Math.random() * 100));
  }

  @ViewChild('wasteChart', { static: false }) wasteChartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.buildGraphic();
  }

  onFiltersChanged() {
    this.buildGraphic();
  }

  buildGraphic() {
    const ctx = this.wasteChartRef?.nativeElement?.getContext('2d');


    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      return;
    }

    if (this.chart)
      this.chart.destroy();

    let labels = this.months.slice(0, this.currentMonth + 1);
    if (this.selectedTime === "weekly"){
      labels = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    } else if (this.selectedTime === 'annual') {
      labels = ['2021', '2022', '2023', '2024', '2025'];
    }

    const  datasetsZn = this.storesSource
      .filter(store => store.amountSensor > 0 )
      .map(store => ({
        label: store.name,
        data: this.generateData(labels.length),
        backgroundColor: store.color,
      }));

    //Build a new graphic
    this.chart = new Chart(ctx, {
      type: this.selectedType as ChartType,
      data: {
        labels: labels,
        datasets: datasetsZn,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'kg'
            },
            beginAtZero: true
          }
        },
        plugins: {
          datalabels: {
            display: false
          }
        }
      },
    });
  }

  private getAlerts() {

    let totalPercentage: number = 0
    let amount: number = 0

    this.storesSource.forEach(store => {
      store.sensorIds.forEach(sensor => {
        this.sensorsSource.forEach(sensorAux => {
          amount = 0
          if (sensorAux.id == sensor) {
            sensorAux.wastesId.forEach(waste => {
              this.wastesSource.forEach(wasteAux => {
                if (wasteAux.id === waste){
                  amount += wasteAux.amount
                }
              })
            })

            const sensorCapacity = parseFloat(sensorAux.capacity);
            if (sensorCapacity > 0) {
              const percentage = ((amount / sensorCapacity) * 100) / sensorAux.wastesId.length;
              sensorAux.percentage = `${percentage.toFixed(0)}%`;

              this.sensorService.updateSensorLocally(sensorAux);

              this.sensorService.update(sensorAux.id, sensorAux).subscribe(() => {
                this.sensorService.updateSensorLocally(sensorAux);
              })

              if (percentage > this.threshold){
                let existSameStore = false;
                this.sensorsAuxSh.push(sensorAux)

                this.storesAuxSh.forEach(st => {
                  if (st.id === store.id){
                    existSameStore = true;
                  }
                })

                if (!existSameStore){
                  this.storesAuxSh.push(store)
                }
              }

            } else {
              sensorAux.percentage = '0%';
            }
          }
        })
      })
    })
  }


  // Get all from api

  private getAllWastes() {
    this.wasteService.getAll().subscribe((wastes: Array<Waste>) => {
      this.wastesSource = wastes;
      this.getAlerts();
    });
  }
}

