import { Component, computed, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { CurrentWeatherCard } from '../current-weather-card/current-weather-card';
import { HighlightsCard } from '../highlights-card/highlights-card';
import { ForecastCard } from '../forecast-card/forecast-card';
import { WeatherMap } from '../weather-map/weather-map';
import type { CurrentWeather, ForecastDay } from '../../services/weather';

export type DashboardOutletData = {
  error: string | null;
  currentWeather: CurrentWeather | null;
  forecastDays: ForecastDay[];
};

@Component({
  selector: 'app-dashboard-home',
  imports: [CurrentWeatherCard, HighlightsCard, ForecastCard, WeatherMap],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome {
  private readonly shell = inject(ROUTER_OUTLET_DATA) as Signal<DashboardOutletData | null>;

  readonly error = computed(() => this.shell()?.error ?? null);
  readonly currentWeather = computed(() => this.shell()?.currentWeather ?? null);
  readonly forecastDays = computed(() => this.shell()?.forecastDays ?? []);
}
