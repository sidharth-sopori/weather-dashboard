import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { environment } from '../config/environment';

export interface CitySuggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface GeocodingResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Geocoding {
  private readonly baseUrl = `${environment.weatherApiBaseUrl}/geo/1.0/direct`;

  constructor(private http: HttpClient) {}

  searchCities(query: string, limit = 5): Observable<CitySuggestion[]> {
    if (!query?.trim()) return new Observable((s) => s.next([]));
    const params = {
      q: query.trim(),
      limit: String(limit),
      appid: environment.weatherApiKey,
    };
    return this.http.get<GeocodingResponse[]>(this.baseUrl, { params }).pipe(
      map((items) =>
        items.map((item) => ({
          name: item.name,
          lat: item.lat,
          lon: item.lon,
          country: item.country,
          state: item.state,
        }))
      )
    );
  }

  createSearchStream(searchInput$: Subject<string>): Observable<CitySuggestion[]> {
    return searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => this.searchCities(q))
    );
  }
}
