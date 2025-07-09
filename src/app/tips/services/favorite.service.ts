
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Action } from '../model/action.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private readonly FAVORITES_API_BASE_URL = `${environment.apiBaseUrl}/users/favorites`;

  constructor(private http: HttpClient) { }

  /**
   * Añade una acción sostenible a los favoritos del usuario actual en el BACKEND.
   * Este endpoint es protegido y requiere el token JWT.
   * @param sustainableActionId El ID de la acción sostenible a añadir.
   * @returns Un Observable que emite la acción sostenible añadida como favorita.
   */
  addFavorite(sustainableActionId: number): Observable<Action> {
    console.log(`[FavoriteService] Llamando al backend para añadir a favoritos: ${sustainableActionId}`);
    return this.http.post<Action>(this.FAVORITES_API_BASE_URL, { sustainableActionId });
  }

  /**
   * Elimina una acción sostenible de los favoritos del usuario actual en el BACKEND.
   * Este endpoint es protegido y requiere el token JWT.
   * @param sustainableActionId El ID de la acción sostenible a eliminar.
   * @returns Un Observable que emite void al completar la operación.
   */
  removeFavorite(sustainableActionId: number): Observable<void> {
    console.log(`[FavoriteService] Llamando al backend para eliminar de favoritos: ${sustainableActionId}`);
    return this.http.delete<void>(`${this.FAVORITES_API_BASE_URL}/${sustainableActionId}`);
  }

  /**
   * Verifica si una acción sostenible específica es favorita para el usuario actual en el BACKEND.
   * Este endpoint es protegido y requiere el token JWT.
   * @param sustainableActionId El ID de la acción sostenible a verificar.
   * @returns Un Observable que emite true si es favorita, false en caso contrario.
   */
  isFavorite(sustainableActionId: number): Observable<boolean> {
    console.log(`[FavoriteService] Llamando al backend para verificar si ${sustainableActionId} es favorito.`);
    return this.http.get<boolean>(`${this.FAVORITES_API_BASE_URL}/check/${sustainableActionId}`);
  }
}
