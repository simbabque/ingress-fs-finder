interface IEvent {
  location: string;
  link: string;
  lat: number;
  lon: number;
  time_local: string;
  datetime: Date;
}

const hours = 1000 * 60 * 60;

export const EventStateNotStarted = 0;
export const EventStateInProgress = 1;
export const EventStateFinished = 2;
export type EventState =
  | typeof EventStateNotStarted
  | typeof EventStateInProgress
  | typeof EventStateFinished;

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

    return day + ' ' + timeFormat.format(this.datetime);
  }

  getCalendarInvite(): string {
    const re = /[:-]|\.\d{3}/g;
    return (
      'https://calendar.google.com/calendar/render?' +
      'action=TEMPLATE&' +
      'text=Ingress%20FS%20' +
      this.location +
      '&dates=' +
      this.datetime.toISOString().replace(re, '') +
      '/' +
      new Date(this.datetime.getTime() + 2 * hours)
        .toISOString()
        .replace(re, '')
    );
  }

  alreadyHappened(): boolean {
    const now = new Date();
    return this.datetime.getTime() + 2 * hours < now.getTime();
  }

  /**
   * Returns the percentage of time that has already happened for
   * this event. Assumes events are two hours long.
   *
   * @return 0 if event hasn't happened yet
   * @return percentage as integer if event is in progress
   * @return 100 if event is over
   */
  finishedPercentage(): number {
    if (this.alreadyHappened()) return 100;

    return Math.max(
      Math.floor(
        ((new Date().getTime() - this.datetime.getTime()) / (2 * hours)) * 100
      ),
      0
    );
  }

  /**
   * Returns the state the event is in as one of three constant values.
   *
   * @return EventState
   */
  state(): EventState {
    if (this.alreadyHappened()) return EventStateFinished;
    const percentage = this.finishedPercentage();
    if (percentage > 0) return EventStateInProgress;
    return EventStateNotStarted;
  }
}
