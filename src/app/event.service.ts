import { Injectable } from '@angular/core';
import { Event } from './event';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  IEventResponse,
  IEventResponseEvent,
} from './models/eventresponse.model';
import { IEventData } from './models/eventdata.model';
@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  private eventsUrl = 'events.json';

  /**
   * Get events from our own events.json file.
   */
  getEventsData(): Observable<IEventData> {
    return this.http.get(this.eventsUrl).pipe(
      map(
        (data: IEventResponse) =>
          <IEventData>{
            year: data.year,
            month: data.month,
            events: data.events
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
          }
      ),
      catchError(
        this.handleError<IEventData>('getEventsData')
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
