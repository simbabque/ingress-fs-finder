interface IEvent {
  location: string;
  link: string;
  lat: number;
  lon: number;
  time_local: string;
  timezone: string;
  datetime: Date;
}

export class Event implements IEvent {
  public location: string;
  public link: string;
  public lat: number;
  public lon: number;
  public time_local: string;
  public timezone: string;
  public datetime: Date;

  constructor(json: any) {
    this.location = json.location;
    this.link = json.link;
    this.lat = json.lat;
    this.lon = json.lon;
    this.time_local = json.time_local;
    this.datetime = json.datetime;
  }

  timeInTimezone(timezone: string): string {
    let dateFormat = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      timeZone: timezone,
    });
    let timeFormat = new Intl.DateTimeFormat('en-GB', {
      timeStyle: 'short',
      timeZone: timezone,
    });

    return dateFormat.format(this.datetime) + " " + timeFormat.format(this.datetime);
  }
}
