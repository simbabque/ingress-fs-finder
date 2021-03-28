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
import { By } from '@angular/platform-browser'; 

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let loader: HarnessLoader;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EventsComponent],
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
          datetime: new Date().setDate(new Date().getDate() + 7),
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
      const link = fixture.nativeElement.querySelector('mat-card a');
      expect(link).toHaveClass('mat-card-avatar');
      expect(link.href).toEqual('http://example.org/');
    });

    it('should display the day and time in the correct timezone', async () => {
      expect(await cards[0].getTitleText()).toEqual('Saturday 20:00');
    });

    it('should change date and time when the timezone changes', async () => {
      component.timezone = 'Europe/Berlin';
      expect(await cards[0].getTitleText()).toEqual('Saturday 21:00');
    });

    it('should mark the past event as past', async () => {
      const card = fixture.nativeElement.querySelector('mat-card');
      expect(card).toHaveClass('past-event');
    });

    it('should not mark the future event as past', async () => {
      const domCards = fixture.nativeElement.querySelectorAll('mat-card');
      expect(domCards[1]).not.toHaveClass('past-event');
    });

    it('should display tootltip on past events', async () => {
      const tooltips = await loader.getAllHarnesses(MatTooltipHarness);
      expect(tooltips.length).toBe(2);

      expect(
        await (await tooltips[0].host()).hasClass('past-event')
      ).toBeTrue();
      expect(
        await (await tooltips[1].host()).hasClass('past-event')
      ).toBeFalse();

      await tooltips[0].show();
      expect(await tooltips[0].getTooltipText()).toEqual(
        'This event has already happened'
      );

      const ttDebugElements = fixture.debugElement.queryAll(By.css('.event-card'));
      const pastEventTooltip = ttDebugElements[0].injector.get<MatTooltip>(MatTooltip);
      const futureEventTooltip = ttDebugElements[1].injector.get<MatTooltip>(MatTooltip);

      expect(pastEventTooltip.disabled).toBeFalse();
      expect(futureEventTooltip.disabled).toBeTrue();
    });
  });
});
