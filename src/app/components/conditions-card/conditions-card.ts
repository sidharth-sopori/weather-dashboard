import { Component, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CurrentWeather } from '../../services/weather';

@Component({
  selector: 'app-conditions-card',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './conditions-card.html',
  styleUrl: './conditions-card.css',
})
export class ConditionsCard {
  weather = input.required<CurrentWeather | null>();

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
