import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {

	public currentNumber: number = 1;
	public example: any = null;
	public images: string[] = [
		'/assets/img/at_01.jpg',
		'/assets/img/at_02.jpg',
		'/assets/img/at_03.jpg',
		'/assets/img/at_04.jpg',
		'/assets/img/rm_01.jpg',
		'/assets/img/rm_02.jpg',
		'/assets/img/rm_03.jpg',
		'/assets/img/rm_04.jpg',
	]
	public examples: any[] = [
		{
			title: 'Simple use',
			html: '<slider-carousel [images]="example.images"></slider-carousel>'
		},
		{
			title: 'With auto-size',
			html: '<slider-carousel [images]="example.images" [auto-size]="true"></slider-carousel>'
		},
		{
			title: 'With auto-size and max-width',
			html: '<slider-carousel [images]="example.images" [auto-size]="true" max-width="500px"></slider-carousel>'
		},
		{
			title: 'With fixed height and max-width',
			html: '<slider-carousel [images]="example.images" height="350px" max-width="600px"></slider-carousel>'
		}
	];

	constructor() {
		this.selectExample(1);
	}

	selectExample(number: number) {
		this.currentNumber = number;
		this.example = this.examples[this.currentNumber - 1];
	}
}
