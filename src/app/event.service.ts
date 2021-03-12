import { Injectable } from '@angular/core';
import { Event } from './event';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface IEventResponseEvent {
  datetime_local: string;
  lat: number;
  link: string;
  location: string;
  lon: number;
  time_local: string;
  timezone: string;
}
interface IEventResponse {
  events: IEventResponseEvent[];
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  private eventsUrl = 'events.json';

  /**
   * Get events from our own events.json file.
   */
  getEvents(): Observable<Event[]> {
    return this.http.get(this.eventsUrl).pipe(
      map(
        (data: IEventResponse) =>
          data.events
            .map((e: IEventResponseEvent) => {
              let datetime = new Date(e.datetime_local);
              delete e.datetime_local;
              return new Event({ ...e, ...{ datetime: datetime } });
            })
            .sort(
              (a, b) =>
                <any>a.datetime - <any>b.datetime ||
                a.location.localeCompare(b.location)
            ),
        catchError(this.handleError<Event[]>('getEvents', []))
      )
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
