// src/app/sustainable-actions/pages/tips/tips.component.ts
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TipsListComponent } from "../../components/tips-list/tips-list.component";
import { Action } from "../../model/action.entity";
import { ActionsCreateAndEditComponent } from "../../components/actions-create-and-edit/actions-create-and-edit.component";
import { CommonModule } from "@angular/common";
import { ActionService } from "../../services/action.service";
import { FavoriteService } from "../../services/favorite.service";
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-sustainable-actions',
  standalone: true,
  imports: [CommonModule, TranslateModule, TipsListComponent, ActionsCreateAndEditComponent],
  templateUrl: './tips.component.html',
  styleUrl: './tips.component.css'
})
export class TipsComponent implements OnInit {
  showModal = false;
  newAction: Action | null = null;

  actions: Action[] = [];

  constructor(
    private actionService: ActionService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadActions();
  }

  /**
   * Carga todas las acciones sostenibles y verifica su estado de favorito desde el backend.
   */
  loadActions(): void {
    this.actionService.getAll().subscribe({
      next: (allActions) => {
        if (Array.isArray(allActions)) {
          if (allActions.length === 0) {
            this.actions = [];
            return;
          }

          const favoriteChecks = allActions.map(action =>
            this.favoriteService.isFavorite(action.id)
              .pipe(
                map(isFav => ({ ...action, favorite: isFav })), // Añade la propiedad 'favorite' a la acción
                catchError(err => {
                  console.error(`Error al verificar favorito para la acción ${action.id}:`, err);
                  return of({ ...action, favorite: false }); // Si hay error, asumimos que no es favorita
                })
              )
          );

          forkJoin(favoriteChecks).subscribe({
            next: (actionsWithFavorites) => {
              this.actions = this.sortActions(actionsWithFavorites); // Actualiza la lista con el estado real de favoritos
              console.log('[TipsComponent] Acciones cargadas con estado de favoritos del backend:', this.actions);
            },
            error: (err) => {
              console.error('Error al combinar las verificaciones de favoritos:', err);

              this.actions = this.sortActions(allActions.map(a => ({ ...a, favorite: false })));
            }
          });

        } else {
          console.error('Los datos recibidos de la API no son un array:', allActions);
          this.actions = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar las acciones:', err);
        this.actions = [];
      }
    });
  }

  openModal() {
    this.newAction = new Action({ id: 0, title: '', description: '', type: '', favorite: false });
    this.showModal = true;
  }

  onSaveAction(action: Action) {
    this.actionService.create(action).subscribe({
      next: (savedAction) => {
        console.log('Acción guardada en el backend:', savedAction);
        this.onCloseModal();
        this.loadActions();
      },
      error: (err) => {
        console.error('Error al guardar la acción:', err);

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

  onCloseModal() {
    this.showModal = false;
    this.newAction = null;
  }

  /**
   * Este método se llama cuando el estado de favorito cambia en TipsListComponent.
   * Dispara una recarga de acciones para reflejar el estado actualizado del backend.
   */
  onFavoriteChanged() {
    console.log('[TipsComponent] Estado de favorito cambiado, recargando acciones...');
    this.loadActions();
  }
}
