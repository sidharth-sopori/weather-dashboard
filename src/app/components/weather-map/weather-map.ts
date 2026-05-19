import { Component, Input, OnChanges, SimpleChanges, viewChild, ElementRef, AfterViewInit } from '@angular/core';

declare const L: any;

@Component({
    selector: 'app-weather-map',
    standalone: true,
    templateUrl: './weather-map.html',
    styleUrl: './weather-map.css'
})
export class WeatherMap implements OnChanges, AfterViewInit {
    @Input({ required: true }) lat!: number;
    @Input({ required: true }) lon!: number;

    private map: any;
    private marker: any;
    private mapContainer = viewChild<ElementRef>('mapContainer');

    ngAfterViewInit() {
        this.initMap();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.map && (changes['lat'] || changes['lon'])) {
            this.updateMap();
        }
    }

    private initMap() {
        const container = this.mapContainer()?.nativeElement;
        if (!container) return;

        this.map = L.map(container, {
            zoomControl: false,
            attributionControl: false
        }).setView([this.lat, this.lon], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(this.map);

        this.marker = L.marker([this.lat, this.lon]).addTo(this.map);

        // Invalidate size to fix rendering issues in hidden/flex containers
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);
    }

    private updateMap() {
        if (this.map) {
            this.map.setView([this.lat, this.lon], 10);
            if (this.marker) {
                this.marker.setLatLng([this.lat, this.lon]);
            } else {
                this.marker = L.marker([this.lat, this.lon]).addTo(this.map);
            }
        }
    }
}
