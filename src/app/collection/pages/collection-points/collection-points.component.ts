import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionCardComponent } from '../../components/collection-card/collection-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FilterTagsComponent } from '../../components/filter-tags/filter-tags.component';
import { CollectionPoint } from '../../model/collection-points.entity';
import { CollectionPointsService } from '../../services/collection-points.service';
import { AddCollectionPointModalComponent } from '../../components/add-collection-point/add-collection-point.component';
import * as L from 'leaflet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-collection-points',
  templateUrl: './collection-points.component.html',
  standalone: true,
  styleUrls: ['./collection-points.component.scss'],
  imports: [
    CommonModule,
    CollectionCardComponent,
    SearchBarComponent,
    FilterTagsComponent,
    MatDialogModule,
    TranslateModule
  ]
})
export class CollectionPointsPage implements OnInit {
  points: CollectionPoint[] = [];
  filteredPoints: CollectionPoint[] = [];
  searchTerm: string = '';
  currentFilter: string = '';

  map!: L.Map;
  markerGroup!: L.LayerGroup;

  constructor(
    private service: CollectionPointsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPoints();
    this.initMap();
  }

  loadPoints() {
    this.service.getAll().subscribe({
      next: (points) => {
        this.points = points;
        this.filteredPoints = points;
        this.updateMapMarkers();
      },
      error: (error) => {
        console.error('Error al cargar los puntos:', error);
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  onFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPoints = this.points.filter(point => {
      const matchesSearch = point.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        point.materials.some(material => material.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesFilter = !this.currentFilter || point.materials.includes(this.currentFilter);
      return matchesSearch && matchesFilter;
    });
    this.updateMapMarkers();
  }

  initMap() {
    this.map = L.map('map').setView([-12.0464, -77.0428], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.markerGroup = L.layerGroup().addTo(this.map);
  }

  updateMapMarkers() {
    this.markerGroup.clearLayers();
    this.filteredPoints.forEach(point => {
      const marker = L.marker([point.lat, point.lng])
        .bindPopup(`
          <strong>${point.name}</strong><br>
          ${point.schedule}<br>
          ${point.phone}<br>
          Materiales: ${point.materials.join(', ')}
        `);
      this.markerGroup.addLayer(marker);
    });
  }

  openAddPointModal(): void {
    const dialogRef = this.dialog.open(AddCollectionPointModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newPoint: CollectionPoint = {
          id: this.generateId(),
          name: result.name,
          schedule: result.schedule,
          phone: result.phone || '',
          materials: result.materials,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lng),
        };

        this.service.addCollectionPoint(newPoint).subscribe({
          next: () => {
            this.points.push(newPoint);
            this.applyFilters(); // Esto actualizará filteredPoints y mapa
          },

          error: (error) => {
            console.error('Error al agregar el punto:', error);
            alert('Hubo un error al agregar el punto de recolección');
          }
        });

      }
    });
  }

  onPointDeleted(id: string) {
    this.points = this.points.filter(point => point.id !== id);
    this.filteredPoints = this.filteredPoints.filter(point => point.id !== id);
    this.updateMapMarkers();
  }


  private generateId(): string {
    return (Math.max(0, ...this.points.map(p => Number(p.id))) + 1).toString();
  }

}
