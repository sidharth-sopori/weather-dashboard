import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Weather, CurrentWeather, ForecastDay, HourlyForecast } from '../../services/weather';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { CitySuggestion } from '../../services/geocoding';
import { FavoritesService } from '../../services/favorites.service';

const DEFAULT_COORDS = { lat: 28.6139, lon: 77.2090 }; // New Delhi

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly weather = inject(Weather);
  private readonly favorites = inject(FavoritesService);
  private readonly router = inject(Router);

  currentWeather = signal<CurrentWeather | null>(null);
  forecastDays = signal<ForecastDay[]>([]);
  hourlyForecast = signal<HourlyForecast[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  readonly outletData = computed(() => ({
    error: this.error(),
    currentWeather: this.currentWeather(),
    forecastDays: this.forecastDays(),
  }));

  constructor() {
    effect(() => {
      const pending = this.favorites.pendingLoad();
      if (pending == null) return;
      this.favorites.clearPending();
      this.loadWeather(pending.lat, pending.lon);
    });

    this.loadWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
  }

  onCitySelected(city: CitySuggestion): void {
    void this.router.navigate(['/dashboard']);
    this.loadWeather(city.lat, city.lon);
  }

  onSearchError(errorMsg: string): void {
    this.error.set(errorMsg);
    this.loading.set(false);
  }

  onCurrentLocation(): void {
    void this.router.navigate(['/dashboard']);
    this.loading.set(true);
    this.error.set(null);

    const fallbackToIP = (reason?: string) => {
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.latitude && data.longitude) {
            this.loadWeather(data.latitude, data.longitude);
          } else {
            throw new Error('Invalid IP location mapping');
          }
        })
        .catch(() => {
          const msg = reason
            ? `Location blocked (${reason}). Please check your browser privacy settings/shields or search manually.`
            : 'Could not get location. Please allow location access or check your browser settings.';
          this.error.set(msg);
          this.loading.set(false);
        });
    };

    if (!navigator.geolocation) {
      fallbackToIP('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.loadWeather(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        let reason = err.message;
        if (err.code === err.PERMISSION_DENIED) reason = 'Permission denied';
        else if (err.code === err.POSITION_UNAVAILABLE) reason = 'Position unavailable';
        else if (err.code === err.TIMEOUT) reason = 'Request timed out';

        fallbackToIP(reason);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
    );
  }

  private loadWeather(lat: number, lon: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.weather.getCurrentWeather(lat, lon).subscribe({
      next: (w) => this.currentWeather.set(w),
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load weather');
        this.loading.set(false);
      },
    });

    this.weather.getForecast(lat, lon).subscribe({
      next: (f) => {
        this.forecastDays.set(f.daily);
        this.hourlyForecast.set(f.hourly);
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }
}
