import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../event';

type EventsByDay = Record<string, Event[]>;

@Pipe({ name: 'eventsByDay' })
export class EventsByDayPipe implements PipeTransform {
  transform(events: Event[], timezone: string): EventsByDay {
    const groupedEvents: EventsByDay = {};
    if (!events) { 
        return groupedEvents;
    }
    for (const event of events) {
      const key = event.dayInTimezone(timezone);
      groupedEvents[key] = groupedEvents[key] || [];
      groupedEvents[key].push(event);
    }
    return groupedEvents;
  }
}
