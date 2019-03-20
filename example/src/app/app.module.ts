import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SliderCarouselModule } from '../../../src/slider-carousel/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SliderCarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
