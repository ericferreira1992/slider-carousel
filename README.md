# slider-carousel | Angular 7+

Angular component of the carousel, using the slider as a transition.
This is a simple, clean and light alternative. It also does not need dependencies.

Compatible with previous versions of Angular, except AngularJS.

## Example ([more examples](#)).

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

## Import into `style.scss` file application.
```sass
@import '~slider-carousel/slider-carousel.scss';
@include slider-carousel();
```
## Or import with colors (default color and background color)
```sass
@import '~slider-carousel/slider-carousel.scss';
@include slider-carousel($defaultColor, $bgColor);
```

# API

## Inputs/Outputs (Required)
Name		                | Type                										| Description
----                    	| ----                										| ----
`images`		            | `string[] | { lg: string, md?: string, sm?: string }[]`	| Address list of the images to be displayed.

## Inputs/Outputs (Optional)
Name		        		| Type      	| Default		| Description
----            			| ----      	| ----			| ----
`preview`   				| `boolean`  	| `true`		| To open full image. (ex .: ``` <... [preview]="true"></...>```).
`auto-size`  				| `string`		| `'100%'`		| Images are displayed each with their respective but responsive measurements. (ex .: ``` <... [auto-size]="true"></...>```).
`height`     				| `string`		| `'500px'`  	| Define a fixed height to container. (ex .: ``` <... height="350px"></...>```).
`width`        				| `string`		| `'100%'`		| Define a fixed width to container. (ex .: ``` <... width="300px"></...>```).
`max-width`  				| `string`		| `'100%'`		| Define a max width to container. (ex .: ``` <... max-width="800px"></...>```).

