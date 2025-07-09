import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {TranslateModule} from "@ngx-translate/core";
import * as L from 'leaflet';
import { AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-add-collection-point',
  standalone: true,
  templateUrl: './add-collection-point.component.html',
  styleUrls: ['./add-collection-point.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
  ]
})
export class AddCollectionPointModalComponent implements AfterViewInit {
  addPointForm: FormGroup;
  map: L.Map | undefined;
  marker: L.Marker | undefined;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCollectionPointModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addPointForm = this.fb.group({
      name: [''],
      schedule: [''],
      phone: [''],
      materials: [''],
      lat: [0],
      lng: [0],
    });
  }
  ngAfterViewInit(): void {
    if (this.map) {
      return; // Evitar inicialización múltiple
    }

    this.map = L.map('modal-map').setView([19.4326, -99.1332], 12); // Ciudad de México

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.addPointForm.patchValue({ lat, lng });

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map!);
      }
    });

    // Centrar en ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const coords = position.coords;
        const userLatLng = L.latLng(coords.latitude, coords.longitude);
        this.map?.setView(userLatLng, 14);
      });
    }
  }


  onSubmit(): void {
    if (this.addPointForm.valid) {
      const formValue = this.addPointForm.value;

      if (typeof formValue.materials === 'string') {
        formValue.materials = formValue.materials.split(',').map((m: string) => m.trim());
      } else {
        formValue.materials = [];
      }

      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Limpia mapa para evitar conflictos
      this.map = undefined;
    }
  }

}
