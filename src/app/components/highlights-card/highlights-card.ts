import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CurrentWeather } from '../../services/weather';

@Component({
  selector: 'app-highlights-card',
  imports: [DatePipe],
  templateUrl: './highlights-card.html',
  styleUrl: './highlights-card.css',
})
export class HighlightsCard {
  weather = input.required<CurrentWeather | null>();
  protected readonly Math = Math;
}
