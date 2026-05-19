import { Component, computed, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { WeatherMap } from '../weather-map/weather-map';
import type { DashboardOutletData } from '../dashboard-home/dashboard-home';

@Component({
  selector: 'app-map-page',
  imports: [WeatherMap],
  templateUrl: './map-page.html',
  styleUrl: './map-page.css',
})
export class MapPage {
  private readonly shell = inject(ROUTER_OUTLET_DATA) as Signal<DashboardOutletData | null>;

  readonly error = computed(() => this.shell()?.error ?? null);
  readonly currentWeather = computed(() => this.shell()?.currentWeather ?? null);
}
