import {
  Event,
  EventStateNotStarted,
  EventStateInProgress,
  EventStateFinished,
} from './event';

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
    event.datetime = new Date('2121-03-06T20:00:00Z');
    expect(event.alreadyHappened()).toBeFalse();
  });

  it('should return the name of the day from dayInTimezone', () => {
    expect(event.dayInTimezone('Europe/London')).toBe('Saturday');
  });

  it('should return a readable date and time from timeInTimezone', () => {
    expect(event.timeInTimezone('Europe/London')).toBe('Saturday 20:00');
  });

  describe('called', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe('before the event', () => {
      beforeEach(() => {
        /* this is 24 hours before the event starts */
        jasmine.clock().mockDate(new Date('2021-03-05T20:00:00Z'));
      });

      it('should return 0 if event has not happened yet', () => {
        expect(event.finishedPercentage()).toBe(0);
      });

      it('should have state EventStateNotStarted', () => {
        expect(event.state()).toBe(EventStateNotStarted);
      });
    });

    describe('during the event', () => {
      beforeEach(() => {
        /* this is one hour into the event */
        jasmine.clock().mockDate(new Date('2021-03-06T21:00:00Z'));
      });

      it('should calculate how much much of its time has passed already', () => {
        expect(event.finishedPercentage()).toBe(50);

        /* move time forward by a little more than two minutes */
        jasmine.clock().tick(121 * 1000);
        expect(event.finishedPercentage()).toBe(51);
      });

      it('should have state EventStateInProgress', () => {
        expect(event.state()).toBe(EventStateInProgress);
      });
    });

    describe('after the event', () => {
      beforeEach(() => {
        /* this is 1 hour after the event ended */
        jasmine.clock().mockDate(new Date('2021-03-06T23:00:00Z'));
      });

      it('should return 100 if event is over', () => {
        expect(event.finishedPercentage()).toBe(100);
      });

      it('should have state EventStateFinished', () => {
        expect(event.state()).toBe(EventStateFinished);
      });
    });
  });
});
