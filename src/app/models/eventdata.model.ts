import { Event } from '../event';
export interface IEventData {
  events: Event[];
  month: string;
  year: number;
  lastUpdated: string;
}
