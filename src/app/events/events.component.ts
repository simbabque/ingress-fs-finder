import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';
import * as data from '../../../events.json';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = data.events
    .map((e) => {
      let datetime = new Date(e.datetime_local);
      delete e.datetime_local;
      return new Event({ ...e, ...{ datetime: datetime } });
    })
    .sort((a, b) => <any>a.datetime - <any>b.datetime || a.location.localeCompare(b.location));

  @Input()
  timezone: string;

  constructor() {}

  ngOnInit(): void {}
}
