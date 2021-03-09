import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatSelectModule } from '@angular/material/select';
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
        imports: [MatSelectModule, NoopAnimationsModule]
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
      const timezones = await loader.getHarness<MatSelectHarness>(
        MatSelectHarness.with({ selector: '#timezone' })
      );
      expect(await timezones.getValueText()).toEqual('Europe/London');
    });
  });
});
