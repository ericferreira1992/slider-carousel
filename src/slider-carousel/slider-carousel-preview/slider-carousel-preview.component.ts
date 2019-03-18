import { Component, OnInit, ElementRef, HostBinding } from '@angular/core';

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

	public imageUrl: string = '';

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
		this.imageUrl = this.modalRef.imageUrl;
		this.loadImage();
	}

	private loadImage() {
		this.loading = true;
		this.img = new Image();
		this.img.onload = () => {
			this.loading = false;
			this.onWindowResize();
		};
		this.img.src = this.imageUrl;
	}

	public onImageChange(imageUrl: string, fileName?: string) {
		if (!this.loading && this.imageUrl !== imageUrl) {
			this.imageUrl = imageUrl;
			this.loadImage();
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
