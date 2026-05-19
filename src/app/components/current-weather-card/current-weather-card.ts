import { Component, computed, inject, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CurrentWeather } from '../../services/weather';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-current-weather-card',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './current-weather-card.html',
  styleUrl: './current-weather-card.css',
})
export class CurrentWeatherCard {
  private readonly favorites = inject(FavoritesService);

  weather = input.required<CurrentWeather | null>();

  readonly isSaved = computed(() => {
    const w = this.weather();
    if (!w) return false;
    return this.favorites.isFavorite(w.coord.lat, w.coord.lon);
  });

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    const w = this.weather();
    if (!w) return;
    const id = this.favorites.coordId(w.coord.lat, w.coord.lon);
    if (this.favorites.isFavorite(w.coord.lat, w.coord.lon)) {
      this.favorites.remove(id);
    } else {
      this.favorites.addFromCurrentWeather(w);
    }
  }

  getWeatherEmoji(icon: string): string {
    const map: Record<string, string> = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return map[icon] ?? '🌤️';
  }
}
