import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { EventsComponent } from './events/events.component';
import { HttpClientModule } from '@angular/common/http';
import { EventsByDayPipe } from './events/events-by-day.pipe';

@NgModule({
  declarations: [AppComponent, EventsComponent, EventsByDayPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
