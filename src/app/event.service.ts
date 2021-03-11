import { Injectable } from '@angular/core';
import { Event } from './event';
import { Observable, of } from 'rxjs';
import * as data from '../../events.json';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor() {}

  getEvents(): Observable<Event[]> {
    return of(data.events
      .map((e) => {
        let datetime = new Date(e.datetime_local);
        delete e.datetime_local;
        return new Event({ ...e, ...{ datetime: datetime } });
      })
      .sort(
        (a, b) =>
          <any>a.datetime - <any>b.datetime ||
          a.location.localeCompare(b.location)
      ));
  }
}
