import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event';

interface Timezone {
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ingress First Saturday Finder';

  timezones: Timezone[] = [
    { value: 'Europe/London' },
    { value: 'Europe/Berlin' },
    { value: 'America/New_York' },
    { value: 'Pacific/Auckland' },
  ];
  timezone: string = this.timezones[0].value;

  /* these come from the events service */
  events: Event[];
  month: string;
  year: number;

  constructor(private eventService: EventService) {}

  getEvents(): void {
    this.eventService.getEventsData().subscribe((data) => {
      this.events = data.events;
      this.month = data.month;
      this.year = data.year;
    });
  }
  ngOnInit(): void {
    this.getEvents();
  }
}
