import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { EventsComponent } from './events.component';
import { Event } from '../event';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatCardModule } from '@angular/material/card';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let loader: HarnessLoader;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EventsComponent],
        imports: [MatCardModule],
        providers: [
          EventsComponent
        ],
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
    let card: MatCardHarness;
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
      ];
      card = await loader.getHarness<MatCardHarness>(MatCardHarness);
    });

    it('should link to the event page', async () => {
      const link = fixture.nativeElement.querySelector('mat-card a');
      expect(link).toHaveClass('mat-card-avatar');
      expect(link.href).toEqual('http://example.org/');
    });

    it('should display the day and time in the correct timezone', async () => {
      expect(await card.getTitleText()).toEqual('Saturday 20:00');
    });

    it('should change date and time when the timezone changes', async () => {
      component.timezone = 'Europe/Berlin';
      expect(await card.getTitleText()).toEqual('Saturday 21:00');
    });
  });
});