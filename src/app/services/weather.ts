import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../config/environment';

export interface CurrentWeather {
  city: string;
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  clouds: number;
  sunrise: Date;
  sunset: Date;
  dateTime: Date;
  coord: { lat: number; lon: number };
}

export interface ForecastDay {
  date: Date;
  temp: number;
  icon: string;
  description: string;
}

export interface HourlyForecast {
  time: Date;
  temp: number;
  icon: string;
  windSpeed: number;
  windDeg: number;
}

interface WeatherApiResponse {
  coord: { lat: number; lon: number };
  name: string;
  dt: number;
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number; deg: number };
  sys: { sunrise: number; sunset: number; country?: string };
  visibility?: number;
}

interface ForecastApiResponse {
  city: { name: string };
  list: Array<{
    dt: number;
    main: { temp: number };
    weather: Array<{ icon: string; description: string }>;
    wind?: { speed: number; deg: number };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class Weather {
  private readonly baseUrl = environment.weatherApiBaseUrl;

  constructor(private http: HttpClient) { }

  getCurrentWeather(lat: number, lon: number): Observable<CurrentWeather> {
    const url = `${this.baseUrl}/data/2.5/weather`;
    const params = {
      lat: String(lat),
      lon: String(lon),
      appid: environment.weatherApiKey,
      units: 'metric',
    };
    return this.http.get<WeatherApiResponse>(url, { params }).pipe(
      map((res) => this.mapCurrentWeather(res))
    );
  }

  getForecast(lat: number, lon: number): Observable<{
    daily: ForecastDay[];
    hourly: HourlyForecast[];
  }> {
    const url = `${this.baseUrl}/data/2.5/forecast`;
    const params = {
      lat: String(lat),
      lon: String(lon),
      appid: environment.weatherApiKey,
      units: 'metric',
    };
    return this.http.get<ForecastApiResponse>(url, { params }).pipe(
      map((res) => this.mapForecast(res))
    );
  }

  private mapCurrentWeather(res: WeatherApiResponse): CurrentWeather {
    const visibilityKm = res.visibility != null ? Math.round(res.visibility / 1000) : 10;
    return {
      city: res.name,
      temp: Math.round(res.main.temp),
      feelsLike: Math.round(res.main.feels_like),
      description: res.weather[0]?.description ?? '',
      icon: res.weather[0]?.icon ?? '01d',
      humidity: res.main.humidity,
      windSpeed: Math.round((res.wind?.speed ?? 0) * 3.6),
      pressure: res.main.pressure,
      visibility: visibilityKm,
      clouds: (res as any).clouds?.all ?? 0,
      sunrise: new Date((res.sys?.sunrise ?? 0) * 1000),
      sunset: new Date((res.sys?.sunset ?? 0) * 1000),
      dateTime: new Date(res.dt * 1000),
      coord: res.coord,
    };
  }

  private mapForecast(res: ForecastApiResponse): {
    daily: ForecastDay[];
    hourly: HourlyForecast[];
  } {
    const list = res.list ?? [];
    const dailyMap = new Map<string, ForecastDay>();
    const hourly: HourlyForecast[] = list.slice(0, 24).map((item) => ({
      time: new Date(item.dt * 1000),
      temp: Math.round(item.main.temp),
      icon: item.weather[0]?.icon ?? '01d',
      windSpeed: Math.round(((item.wind?.speed ?? 0) * 3.6)),
      windDeg: item.wind?.deg ?? 0,
    }));

    list.forEach((item) => {
      const d = new Date(item.dt * 1000);
      const key = d.toISOString().slice(0, 10);
      if (!dailyMap.has(key) && dailyMap.size < 7) {
        dailyMap.set(key, {
          date: d,
          temp: Math.round(item.main.temp),
          icon: item.weather[0]?.icon ?? '01d',
          description: item.weather[0]?.description ?? '',
        });
      }
    });

    return {
      daily: Array.from(dailyMap.values()),
      hourly,
    };
  }
}
