export interface Event {
  location: string;
  link: string;
  lat: number;
  lon: number;
  time_local: string;
  timezone: string;
  datetime_local: Date;
}
