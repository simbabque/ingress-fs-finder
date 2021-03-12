import { TestBed } from '@angular/core/testing';
import { IEventResponse } from './models/eventresponse.model';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService],
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('retrieves and sorts events', () => {
    const mockEvents: IEventResponse = {
      events: [
        {
          datetime_local: '2021-03-06T22:00:00Z',
          lat: 51.207015,
          link: 'http://example.org',
          location: 'Andover',
          lon: -1.479153,
          time_local: '10:00 pm',
          timezone: 'Europe/London',
        },
        {
          datetime_local: '2021-03-06T20:00:00Z',
          lat: 51.207015,
          link: 'http://example.org',
          location: 'London',
          lon: -1.479153,
          time_local: '08:00 pm',
          timezone: 'Europe/London',
        },
      ],
    };

    service.getEvents().subscribe((events) => {
      expect(events.length).toBe(2);
      expect(events[0].location).toEqual('London');
    });

    const request = httpMock.expectOne('events.json');
    expect(request.request.method).toBe('GET');
    request.flush(mockEvents);
  });
});
