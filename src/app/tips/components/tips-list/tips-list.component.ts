// src/app/sustainable-actions/components/tips-list/tips-list.component.ts
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { TipsCardComponent } from "../tips-card/tips-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Action } from '../../model/action.entity';
import { TranslateModule } from "@ngx-translate/core";
import { ActionService } from '../../services/action.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-tips-list',
  standalone: true,
  imports: [CommonModule, TipsCardComponent, FormsModule, TranslateModule],
  templateUrl: './tips-list.component.html',
  styleUrl: './tips-list.component.css'
})
export class TipsListComponent implements OnChanges {
  constructor(
    private actionService: ActionService,
    private favoriteService: FavoriteService
  ) {}

  @Input() actions: Action[] = [];
  @Output() favoriteChanged = new EventEmitter<void>();

  filteredActions: Action[] = [];
  searchTerm: string = '';
  filterType: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actions']) {
      this.applyFilters();
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilter(type: string): void {
    this.filterType = type;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let tempFiltered = this.actions.filter(a =>
      a.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.filterType || a.type === this.filterType)
    );
    this.filteredActions = this.sortActions(tempFiltered); // Asegúrate de que el orden de favoritos se mantenga

    this.totalPages = Math.ceil(this.filteredActions.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }
  }

  get displayedActions(): Action[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredActions.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Alterna el estado de favorito de una acción, interactuando con el backend.
   * Proporciona feedback visual inmediato.
   * @param action La acción a la que se le quiere cambiar el estado de favorito.
   */
  toggleFavorite(action: Action): void {
    const updatedAction = { ...action, favorite: !action.favorite };

    this.actions = this.actions.map(a => a.id === updatedAction.id ? updatedAction : a);
    this.applyFilters();

    if (updatedAction.favorite) {

      this.favoriteService.addFavorite(updatedAction.id).subscribe({
        next: () => {
          console.log('Acción añadida a favoritos en el backend:', updatedAction.id);
        },
        error: (err) => {
          console.error('Error al añadir a favoritos en el backend:', err);

          this.actions = this.actions.map(a => a.id === updatedAction.id ? { ...updatedAction, favorite: !updatedAction.favorite } : a);
          this.applyFilters();

        }
      });
    } else {

      this.favoriteService.removeFavorite(updatedAction.id).subscribe({
        next: () => {
          console.log('Acción eliminada de favoritos en el backend:', updatedAction.id);

        },
        error: (err) => {
          console.error('Error al eliminar de favoritos en el backend:', err);

          this.actions = this.actions.map(a => a.id === updatedAction.id ? { ...updatedAction, favorite: !updatedAction.favorite } : a);
          this.applyFilters();

        }
      });
    }
  }

  deleteAction(id: number): void {
    this.actionService.delete(id).subscribe({
      next: () => {
        console.log('Acción eliminada del backend:', id);

        this.actions = this.actions.filter(a => a.id !== id);
        this.applyFilters();
        this.favoriteChanged.emit();
      },
      error: (err) => {
        console.error('Error al eliminar acción del backend:', err);
      }
    });
  }

  private sortActions(actions: Action[]): Action[] {
    return [...actions].sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return a.title.localeCompare(b.title);
    });
  }
}
