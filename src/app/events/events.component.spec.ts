import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { EventsComponent } from './events.component';
import { Event } from '../event';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventsByDayPipe } from './events-by-day.pipe';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let loader: HarnessLoader;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EventsComponent, EventsByDayPipe],
        imports: [MatCardModule, MatTooltipModule, NoopAnimationsModule],
        providers: [EventsComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(EventsComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('The User Interface', () => {
    let cards: MatCardHarness[];
    beforeEach(async () => {
      fixture.detectChanges();
      component.timezone = 'Europe/London';
      component.events = [
        new Event({
          datetime: new Date('2021-03-06T20:00:00Z'),
          lat: '51.207015',
          link: 'http://example.org',
          location: 'Andover, United Kingdom',
          lon: '-1.479153',
          time_local: '08:00 pm',
          timezone: 'Europe/London',
        }),
        new Event({
          datetime: new Date(new Date().getTime() - 1000 * 60 * 60), // 1 hour in
          lat: '51.207015',
          link: 'http://example.org',
          location: 'Andover, United Kingdom',
          lon: '-1.479153',
          time_local: '08:00 pm',
          timezone: 'Europe/London',
        }),
        new Event({
          datetime: new Date('2121-03-06T20:00:00Z'), // I won't have to fix that bug :)
          lat: '51.207015',
          link: 'http://example.org',
          location: 'Andover, United Kingdom',
          lon: '-1.479153',
          time_local: '08:00 pm',
          timezone: 'Europe/London',
        }),
      ];
      cards = await loader.getAllHarnesses<MatCardHarness>(MatCardHarness);
    });

    it('should link to the event page', async () => {
      const link = <HTMLAnchorElement>(
        fixture.nativeElement.querySelector('mat-card a')
      );
      expect(link).toHaveClass('mat-card-avatar');
      expect(link.href).toEqual('http://example.org/');
    });

    it('should display the day and time in the correct timezone', async () => {
      expect(await cards[0].getTitleText()).toEqual('Saturday 20:00');
    });

    it('should change date and time when the timezone changes', async () => {
      component.timezone = 'Europe/Berlin';
      cards = await loader.getAllHarnesses<MatCardHarness>(MatCardHarness);
      expect(await cards[0].getTitleText()).toEqual('Saturday 21:00');
    });

    it('should mark the past event as past', async () => {
      const card = <HTMLElement>fixture.nativeElement.querySelector('mat-card');
      expect(card).toHaveClass('past-event');
    });

    it('should not mark the future event as past', async () => {
      const domCards = <HTMLElement[]>(
        fixture.nativeElement.querySelectorAll('mat-card')
      );
      expect(domCards[1]).not.toHaveClass('past-event');
    });

    it('should get the right background gradient', async () => {
      const domCards = <HTMLElement[]>(
        fixture.nativeElement.querySelectorAll('mat-card')
      );
      // we are ignoring the actual colour of the gradient
      expect(domCards[1].style.background).toBe(
        'linear-gradient(90deg, var(--past-bg-color) 50%, rgba(255,255,255,0) 50%)'
      );
    });

    describe('tooltips', () => {
      let tooltips: MatTooltipHarness[];
      beforeEach(async () => {
        tooltips = await loader.getAllHarnesses(MatTooltipHarness);
      });

      it('should have exactly three tooltips', () => {
        expect(tooltips.length).toBe(3);
      });

      it('should display on past events', async () => {
        await tooltips[0].show();
        expect(await tooltips[0].getTooltipText()).toEqual(
          'This event has already happened'
        );
      });

      it('should display on running events', async () => {
        await tooltips[1].show();
        expect(await tooltips[1].getTooltipText()).toEqual(
          'This event is currently in progress, but you can still join'
        );
      });

      it('should display on future events', async () => {
        await tooltips[2].show();
        expect(await tooltips[2].getTooltipText()).toEqual(
          'This event has not started yet'
        );
      });
    });
  });
});
