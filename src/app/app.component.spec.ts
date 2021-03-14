import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from './event';
import { IEventData } from './models/eventdata.model';
import { EventService } from './event.service';

class MockEventService {
  getEventsData(): Observable<IEventData> {
    return of({
      events: [
        new Event({
          datetime: new Date('2021-03-06T20:00:00Z'),
          lat: '51.207015',
          link: 'http://example.org',
          location: 'Andover, United Kingdom',
          lon: '-1.479153',
          time_local: '08:00 pm',
          timezone: 'Europe/London',
        }),
      ],
      month: 'March',
      year: 2021,
    });
  }
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let loader: HarnessLoader;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [MatMenuModule, NoopAnimationsModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: EventService, useClass: MockEventService }],
      }).compileComponents();
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;

      loader = TestbedHarnessEnvironment.loader(fixture);
    })
  );

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Ingress First Saturday Finder'`, () => {
    expect(component.title).toEqual('Ingress First Saturday Finder');
  });

  it('should not have events after construction', () => {
    expect(component.events).toBeUndefined();
  });

  it('should have events after Angular calls ngOnInit', () => {
    component.ngOnInit();
    expect(component.events[0]).toBeInstanceOf(Event);
  });

  it('should have a date after Angular calls ngOnInit', () => {
    component.ngOnInit();
    expect(component.year).toBe(2021);
    expect(component.month).toBe('March');
  });

  describe('The User Interface', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      component.ngOnInit();
    });

    it('should render title', () => {
      const compiled = fixture.nativeElement;
      expect(
        compiled.querySelector('mat-toolbar .title').textContent
      ).toContain(component.title);
    });

    it('should render the date', () => {
      const compiled = fixture.nativeElement;
      expect(
        compiled.querySelector('mat-toolbar .eventDate').textContent
      ).toContain(component.year, component.month);
    });

    it('should have London preselected', async () => {
      const menu = await loader.getHarness<MatMenuHarness>(MatMenuHarness);
      await menu.open();
      const items = await menu.getItems();

      const itemLondon = await items[0].getText();
      expect(itemLondon).toContain('Europe/London');
      expect(itemLondon).toContain('radio_button_checked'); // TODO

      expect(await items[1].getText()).toContain('radio_button_unchecked'); // TODO
    });
  });
});
