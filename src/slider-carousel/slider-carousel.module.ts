import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderCarouselComponent } from './slider-carousel.component';
import { SliderCarouselPreviewComponent } from './slider-carousel-preview/slider-carousel-preview.component';
import { Helper } from './helper';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        SliderCarouselComponent
    ],
    declarations: [
        SliderCarouselComponent,
        SliderCarouselPreviewComponent
    ],
    entryComponents: [
        SliderCarouselComponent,
        SliderCarouselPreviewComponent
    ],
    providers: [
        Helper
    ]
})
export class SliderCarouselModule { }
