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

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve and sort events', () => {
    const mockResponse: IEventResponse = {
      year: 2021,
      month: 'March',
      created: '2021-03-30',
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

    service.getEventsData().subscribe((data) => {
      expect(data.events.length).toBe(2);
      expect(data.events[0].location).toEqual('London');
      expect(data.year).toBe(2021);
      expect(data.month).toBe('March');
      expect(data.lastUpdated).toBe('2021-03-30');
    });

    const request = httpMock.expectOne('events.json');
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
