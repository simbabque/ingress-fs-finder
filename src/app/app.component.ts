import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ingress First Saturday Finder';
  titleSmall = 'IFS';

  timezones: string[] = [
    ...new Set([
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Europe/London',
      'Europe/Berlin',
      'America/New_York',
      'Pacific/Auckland',
    ]),
  ];
  timezone: string = this.timezones[0];

  /* these come from the events service */
  events: Event[];
  month: string;
  year: number;
  lastUpdated: string;

  constructor(private eventService: EventService) {}

  getEvents(): void {
    this.eventService.getEventsData().subscribe((data) => {
      this.events = data.events;
      this.month = data.month;
      this.year = data.year;
      this.lastUpdated = data.lastUpdated;
    });
  }
  ngOnInit(): void {
    this.getEvents();
  }
}
