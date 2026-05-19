import { Component, output, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, take } from 'rxjs';
import { Geocoding, CitySuggestion } from '../../services/geocoding';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css',
})
export class SearchBox {
  citySelected = output<CitySuggestion>();
  searchError = output<string>();
  currentLocationClicked = output<void>();

  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  query = '';
  suggestions: CitySuggestion[] = [];
  showDropdown = false;
  private searchSubject = new Subject<string>();

  constructor(private geocoding: Geocoding) {
    this.geocoding.createSearchStream(this.searchSubject).subscribe((results) => {
      this.suggestions = results;
      this.showDropdown = results.length > 0 && this.query.trim().length > 0;
    });
  }

  onInput(): void {
    this.searchSubject.next(this.query);
  }

  selectCity(city: CitySuggestion): void {
    this.citySelected.emit(city);
    this.query = city.name + (city.state ? `, ${city.state}` : '') + `, ${city.country}`;
    this.suggestions = [];
    this.showDropdown = false;
  }

  onSearchClick(): void {
    const queryStr = this.query.trim();
    if (!queryStr) return;
    
    this.geocoding.searchCities(queryStr, 1).subscribe({
      next: (results) => {
        if (results.length > 0) {
          this.selectCity(results[0]);
        } else {
          this.searchError.emit(`City "${queryStr}" not found`);
        }
      },
      error: () => {
        this.searchError.emit(`Error searching for city "${queryStr}"`);
      }
    });
  }

  onCurrentLocation(): void {
    this.currentLocationClicked.emit();
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  onFocus(): void {
    if (this.suggestions.length > 0 && this.query.trim()) this.showDropdown = true;
  }
}
