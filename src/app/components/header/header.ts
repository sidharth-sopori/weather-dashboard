import { Component, OnDestroy, output, signal } from '@angular/core';
import { Theme } from '../../services/theme';
import { SearchBox } from '../search-box/search-box';
import { CitySuggestion } from '../../services/geocoding';

@Component({
  selector: 'app-header',
  imports: [SearchBox],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnDestroy {
  citySelected = output<CitySuggestion>();
  searchError = output<string>();
  currentLocationClicked = output<void>();
  readonly currentTime = signal(this.formatTime(new Date()));
  private readonly clockTimer: ReturnType<typeof setInterval>;

  constructor(protected theme: Theme) {
    this.clockTimer = setInterval(() => {
      this.currentTime.set(this.formatTime(new Date()));
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.clockTimer);
  }

  onCitySelected(city: CitySuggestion): void {
    this.citySelected.emit(city);
  }

  onSearchError(error: string): void {
    this.searchError.emit(error);
  }

  onCurrentLocation(): void {
    this.currentLocationClicked.emit();
  }

  private formatTime(date: Date): string {
    const datePart = date.toLocaleDateString([], {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
    const timePart = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return `${datePart} • ${timePart}`;
  }
}
