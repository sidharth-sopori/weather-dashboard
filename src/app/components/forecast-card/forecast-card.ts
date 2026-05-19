import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ForecastDay } from '../../services/weather';

@Component({
  selector: 'app-forecast-card',
  imports: [DatePipe],
  templateUrl: './forecast-card.html',
  styleUrl: './forecast-card.css',
})
export class ForecastCard {
  forecast = input.required<ForecastDay[] | null>();

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
