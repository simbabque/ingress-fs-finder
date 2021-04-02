import { EventsByDayPipe } from './events-by-day.pipe';
import { Event } from '../event';

fdescribe('EventsByDayPipe', () => {
  let pipe: EventsByDayPipe;
  let events: Event[];

  beforeEach(() => {
    events = [
      new Event({
        datetime: new Date('2021-03-07T20:00:00Z'),
        lat: 51.207015,
        link: 'http://example.org',
        location: 'London',
        lon: -1.479153,
        time_local: '10:00 pm',
      }),
      new Event({
        datetime: new Date('2021-03-07T23:00:00Z'),
        lat: 51.207015,
        link: 'http://example.org',
        location: 'Dublin',
        lon: -1.479153,
        time_local: '10:00 pm',
      }),
      new Event({
        datetime: new Date('2021-03-08T23:00:00Z'),
        lat: 51.207015,
        link: 'http://example.org',
        location: 'Berlin',
        lon: -1.479153,
        time_local: '10:00 pm',
      }),
    ];
    pipe = new EventsByDayPipe();
  });

  it('groups the events into the correct days', () => {
    const groupedEvents = pipe.transform(events, 'Europe/London');
    expect(Object.keys(groupedEvents)).toEqual(
      jasmine.arrayWithExactContents(['Sunday', 'Monday'])
    );
    expect(groupedEvents['Sunday'][0].location).toBe('London');
    expect(groupedEvents['Sunday'][1].location).toBe('Dublin');
    expect(groupedEvents['Monday'][0].location).toBe('Berlin');
  });

  it('passes the timezone correctly', () => {
    const groupedEvents = pipe.transform(events, 'Europe/Moscow');
    expect(Object.keys(groupedEvents)).toEqual(
      jasmine.arrayWithExactContents(['Sunday', 'Monday', 'Tuesday'])
    );
    expect(groupedEvents['Sunday'][0].location).toBe('London');
    expect(groupedEvents['Monday'][0].location).toBe('Dublin');
    expect(groupedEvents['Tuesday'][0].location).toBe('Berlin');
  });

  it('can deal with no events', () => {
    expect(pipe.transform(undefined, 'Europe/London')).toEqual({});
  });
});
