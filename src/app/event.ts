interface IEvent {
  location: string;
  link: string;
  lat: number;
  lon: number;
  time_local: string;
  datetime: Date;
}

export class Event implements IEvent {
  public location: string;
  public link: string;
  public lat: number;
  public lon: number;
  public time_local: string;
  public datetime: Date;

  constructor(json: any) {
    this.location = json.location;
    this.link = json.link;
    this.lat = json.lat;
    this.lon = json.lon;
    this.time_local = json.time_local;
    this.datetime = json.datetime;
  }

  dayInTimezone(timezone: string): string {
    const dateFormat = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      timeZone: timezone,
    });
    return dateFormat.format(this.datetime);
  }

  timeInTimezone(timezone: string): string {
    const day = this.dayInTimezone(timezone);
    const timeFormat = new Intl.DateTimeFormat('en-GB', {
      timeStyle: 'short',
      timeZone: timezone,
    });

    return day + " " + timeFormat.format(this.datetime);
  }

  alreadyHappened(): boolean {
    const now = new Date();
    return this.datetime < now;
  }
}
