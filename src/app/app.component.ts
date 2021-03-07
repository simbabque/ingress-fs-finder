import { Component } from '@angular/core';

interface Timezone {
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Ingress First Saturday Finder';

  timezones: Timezone[] = [
    { value: 'Europe/London' },
    { value: 'Europe/Berlin' },
    { value: 'America/New_York' },
    { value: 'Pacific/Auckland' },
  ];

  timezone: string = this.timezones[0].value;
}
