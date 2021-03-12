import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let loader: HarnessLoader;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [MatMenuModule, NoopAnimationsModule],
      }).compileComponents();
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
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

  describe('The User Interface', () => {
    it('should render title', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('mat-toolbar span').textContent).toContain(
        component.title
      );
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
