import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService, FavoriteCity } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites-page',
  imports: [RouterLink],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.css',
})
export class FavoritesPage {
  private readonly router = inject(Router);
  protected readonly favoritesService = inject(FavoritesService);

  openFavorite(f: FavoriteCity): void {
    this.favoritesService.requestLoadCity(this.favoritesService.toSuggestion(f));
    void this.router.navigate(['/dashboard']);
  }

  removeFavorite(f: FavoriteCity, event: Event): void {
    event.stopPropagation();
    this.favoritesService.remove(f.id);
  }

  formatSubtitle(f: FavoriteCity): string {
    const parts = [f.state, f.country].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Saved location';
  }
}
