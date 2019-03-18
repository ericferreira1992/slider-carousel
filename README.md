# slider-carousel | Angular 7+

Angular component of carousel, using slider as transition. This is a simple, clean and light alternative.

Compatible with previous versions of Angular, except AngularJS.

## Example See a ([more examples](#)).

```html
<slider-carousel [images]="example.images"></slider-carousel>
```
![](example.jpg)

# Usage

## Install
`npm install slider-carousel`

## Import into Module
```typescript
import { SliderCarouselModule } from 'slider-carousel';

@NgModule({
  imports: [
    ...,
    SliderCarouselModule
  ],
  declarations: [...],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Import into style.scss file application.
```sass
@import '~slider-carousel/slider-carousel.scss';
@include slider-carousel();
...
```

