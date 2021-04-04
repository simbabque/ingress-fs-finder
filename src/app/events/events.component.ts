import { Component, Input } from '@angular/core';
import {
  Event,
  EventStateNotStarted,
  EventStateInProgress,
  EventStateFinished,
} from '../event';

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

  tooltips = {
    [EventStateNotStarted]: 'This event has not started yet',
    [EventStateInProgress]:
      'This event is currently in progress, but you can still join',
    [EventStateFinished]: 'This event has already happened',
  };

  getBackgroundGradient(event: Event): string {
    const percentage = event.finishedPercentage();
    return `linear-gradient(90deg, var(--past-bg-color) ${percentage}%, rgba(255,255,255,0) ${percentage}%)`;
  }
}
