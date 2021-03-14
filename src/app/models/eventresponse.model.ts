export interface IEventResponseEvent {
    datetime_local: string;
    lat: number;
    link: string;
    location: string;
    lon: number;
    time_local: string;
    timezone: string;
  }
  export interface IEventResponse {
    events: IEventResponseEvent[];
    month: string;
    year: number;
  }