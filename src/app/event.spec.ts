import { Event } from './event';

describe('Event', () => {
  let event: Event;

  beforeEach(() => {
    event = new Event({
      datetime: new Date('2021-03-06T20:00:00Z'),
      lat: 51.207015,
      link: 'http://example.org',
      location: 'London',
      lon: -1.479153,
      time_local: '10:00 pm',
    });
  });

  it('should know it happened when it is in the past', () => {
    expect(event.alreadyHappened()).toBeTrue();
  });

  it('should know it has not happened when it is in the future', () => {
    event.datetime = new Date('2021-03-06T20:00:00Z');
    expect(event.alreadyHappened()).toBeTrue();
  });

  it('should return the name of the day from dayInTimezone', () => {
    expect(event.dayInTimezone('Europe/London')).toBe('Saturday');
  });

  it('should return a readable date and time from timeInTimezone', () => {
    expect(event.timeInTimezone('Europe/London')).toBe('Saturday 20:00');
  });
});
