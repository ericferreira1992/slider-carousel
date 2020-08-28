import { Component, OnInit, ElementRef, HostBinding } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';

@Component({
	selector: 'slider-carousel-preview',
	templateUrl: './slider-carousel-preview.component.html',
	host: {
		'(document:keydown)': 'onKeydown($event)',
		'(window:resize)': 'onWindowResize()'
	}
})
export class SliderCarouselPreviewComponent implements OnInit {
	@HostBinding('class.slider-carousel-preview') public class: boolean = true;
	@HostBinding('class.closed') public closedClass: boolean = false;

	public imageUrl: SafeValue | string = '';

	public loading: boolean = true;

	private img: HTMLImageElement;
	private scaleRate: number = 1;

	private modalRef: { [key: string]: any } = {};

	public get width(): string { return (this.loading ? 0 : this.img.width * this.scaleRate) + 'px'; }
	public get height(): string { return (this.loading ? 0 : this.img.height * this.scaleRate) + 'px'; }

	private get windowWidth(): number { return window.innerWidth - 40; }
	private get windowHeight(): number { return window.innerHeight - 40; }

	constructor(
		public elRef: ElementRef<HTMLElement>
	) {
	}

	ngOnInit() {
		this.imageUrl = this.modalRef.image.safeUrl;
		this.loadImage(this.modalRef.image.pureUrl);
	}

	private loadImage(imageUrl: string) {
		this.loading = true;
		this.img = new Image();
		this.img.onload = () => {
			this.loading = false;
			this.onWindowResize();
		};
		this.img.src = imageUrl;
	}

	public onImageChange(image: { [key: string]: any }, fileName?: string) {
		if (!this.loading && this.imageUrl !== image.safeUrl) {
			this.imageUrl = image.safeUrl;
			this.loadImage(image.pureUrl);
		}
	}

	onKeydown(event: KeyboardEvent) {
		event.preventDefault();
		event.stopImmediatePropagation();

		if (event.keyCode === 27)
			this.close();
	}

	onWindowResize() {
		if (!this.loading) {
			let widthDiff = this.windowWidth - this.img.width;
			let heightDiff = this.windowHeight - this.img.height;

			if (widthDiff < 0 || heightDiff < 0) {
				if (widthDiff < heightDiff) {
					if (this.img.width > this.windowWidth) {
						this.scaleRate = this.windowWidth / this.img.width;
						return;
					}
				}
				else {
					if (this.img.height > this.windowHeight) {
						this.scaleRate = this.windowHeight / this.img.height;
						return;
					}
				}
			}
		}
		this.scaleRate = 1;
	}

	close() {
		this.closedClass = true;
		setTimeout(() => this.modalRef.close(), 500);
	}
}
