import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';
import { EventService } from '../event.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[];

  @Input()
  timezone: string;

  constructor(private eventService: EventService) {}

  getEvents(): void {
    this.eventService.getEvents().subscribe((events) => (this.events = events));
  }
  ngOnInit(): void {
    this.getEvents();
  }
}
