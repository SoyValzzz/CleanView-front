export class CollectionPoint {
  id: string;
  name: string;
  schedule: string;
  phone: string;
  materials: string[];
  lat: number;
  lng: number;

  constructor() {
    this.id = '';  // inicializa como string vacío
    this.name = '';
    this.schedule = '';
    this.phone = '';
    this.materials = [];
    this.lat = 0;
    this.lng = 0;
  }
}
