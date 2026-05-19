import { Component, signal, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Output() currentLocationClicked = new EventEmitter<void>();

  collapsed = signal(false);

  toggle(): void {
    this.collapsed.update((v) => !v);
  }

  onLocationClick(): void {
    this.currentLocationClicked.emit();
  }
}
