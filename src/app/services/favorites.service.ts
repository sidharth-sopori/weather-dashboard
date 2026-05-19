import { Injectable, signal } from '@angular/core';
import type { CitySuggestion } from './geocoding';
import type { CurrentWeather } from './weather';

const STORAGE_KEY = 'yourweather-favorites';

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  /** When set, Dashboard loads this city then clears it. */
  readonly pendingLoad = signal<CitySuggestion | null>(null);

  readonly favorites = signal<FavoriteCity[]>([]);

  constructor() {
    this.restore();
  }

  coordId(lat: number, lon: number): string {
    return `${lat.toFixed(4)},${lon.toFixed(4)}`;
  }

  isFavorite(lat: number, lon: number): boolean {
    const id = this.coordId(lat, lon);
    return this.favorites().some((f) => f.id === id);
  }

  addFromCurrentWeather(w: CurrentWeather): void {
    const id = this.coordId(w.coord.lat, w.coord.lon);
    if (this.favorites().some((f) => f.id === id)) return;
    const next: FavoriteCity = {
      id,
      name: w.city,
      lat: w.coord.lat,
      lon: w.coord.lon,
      country: '',
    };
    this.favorites.update((list) => [...list, next]);
    this.persist();
  }

  remove(id: string): void {
    this.favorites.update((list) => list.filter((f) => f.id !== id));
    this.persist();
  }

  toSuggestion(f: FavoriteCity): CitySuggestion {
    return {
      name: f.name,
      lat: f.lat,
      lon: f.lon,
      country: f.country,
      state: f.state,
    };
  }

  requestLoadCity(city: CitySuggestion): void {
    this.pendingLoad.set(city);
  }

  clearPending(): void {
    this.pendingLoad.set(null);
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites()));
    } catch {
      /* ignore quota / private mode */
    }
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as FavoriteCity[];
      if (!Array.isArray(parsed)) return;
      this.favorites.set(parsed.filter((f) => f?.id && typeof f.lat === 'number' && typeof f.lon === 'number'));
    } catch {
      /* ignore */
    }
  }
}
