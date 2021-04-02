import { Component, Input } from '@angular/core';
import { Event } from '../event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  @Input()
  events: Event[];

  @Input()
  timezone: string;
}
