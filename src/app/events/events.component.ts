import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  event: Event = {
    datetime_local: new Date('2021-03-06T13:00:00+10:30'),
    lat: -35.553774,
    link: 'http://fevgames.net/ifs/event?e=20036',
    location: 'Adelaide, Australia',
    lon: 138.627584,
    time_local: '01:00 pm',
    timezone: 'Australia/Adelaide',
  };

  @Input()
  timezone: string;

  constructor() {}

  ngOnInit(): void {}
}
