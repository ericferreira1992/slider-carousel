import { Component, OnInit, HostBinding, Input, ElementRef, ViewChild, OnDestroy, OnChanges, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { SliderCarouselPreviewComponent } from './slider-carousel-preview/slider-carousel-preview.component';
import { Helper } from './helper';

@Component({
	selector: 'slider-carousel',
	templateUrl: './slider-carousel.component.html',
	host: {
		'(document:keydown)': 'onKeydown($event)',
		'(window:resize)': 'onWindowResize()'
	}
})
export class SliderCarouselComponent implements OnInit, OnChanges, OnDestroy {
	@HostBinding('class.slider-carousel') public class: boolean = true;

	@ViewChild('section') private sectionEl: ElementRef<HTMLElement>;
	@ViewChild('imageList') private imageListEl: ElementRef<HTMLElement>;
	@ViewChild('innerImages') private innerImagesEl: ElementRef<HTMLElement>;

	@Input() public images: { lg: string, md?: string, sm?: string }[] | string[] = [];

	@Input() public preview: boolean = true;
	@Input() public height: string = '500px';
	@Input() public width: string = '100%';
	@Input('max-width') public maxWidth: string = '100%';
	@Input('auto-size') public autoSize: boolean = false;

	public initialized: boolean = false;

	public currentImageIndex: number = 0;
	public lastDirectionIsRight: boolean = false;

	private timerSroll: any;

	public containerWidth: number = 0;

	private destroyed: boolean = false;
	public windowResizing: boolean = false;
	private previewRef: {
		onClose: Observable<any>,
		instance: SliderCarouselPreviewComponent
	};

	private listeners: (() => void)[] = [];

	public get currentImage() { return this.images[this.currentImageIndex]; }
	public get currentIsFisrt() { return this.currentImageIndex === 0; }
	public get currentIsLast() { return this.currentImageIndex === (this.images.length - 1); }

	public get isDragging() { return this.drag.state !== 'none'; }
	public drag = {
		state: 'none', // 'start', 'dragging', 'none'
		startOffset: 0,
		currentOffset: 0,
		startLeft: 0,
		currentLeft: 0,
	};

	constructor(
		private renderer: Renderer2,
		private helper: Helper
	) {
	}

	ngOnInit() {
	}

	ngOnChanges() {
		this.prepare();
	}

	private prepare() {
		if (typeof this.height !== 'string')
			this.height = '500px';
		else if (!this.height.endsWith('%') && !this.height.endsWith('px'))
			this.height += 'px';

		if (typeof this.width !== 'string')
			this.width = '100%';
		else if (!this.width.endsWith('%') && !this.width.endsWith('px'))
			this.width += 'px';

		if (typeof this.maxWidth !== 'string')
			this.maxWidth = '100%';
		else if (!this.maxWidth.endsWith('%') && !this.maxWidth.endsWith('px'))
			this.maxWidth += 'px';

		this.initialized = true;
		this.checkImages();
		this.initSlideDragWatching();
		this.defineContainerWidth();
	}

	private checkImages() {
		if (this.images && this.images.length) {
			if (typeof this.images[0] !== 'string') {
				(this.images as { lg: string, md?: string, sm?: string }[]).forEach((image) => {
					if (!image.md)
						image.md = image.lg;
					if (!image.sm)
						image.sm = image.md;
				});
			}
			else
				this.images = (this.images as string[]).map((image) => {
					return { lg: image, md: image, sm: image };
				});
		}
	}

	private initSlideDragWatching() {
		if (this.innerImagesEl && this.innerImagesEl.nativeElement) {
			this.stopSlideDragWatching();

			if (this.helper.isMobileDevice())
				this.listeners = [
					this.renderer.listen(document.body, 'touchstart', this.onStartDrag.bind(this)),
					this.renderer.listen(document.body, 'touchmove', this.onDragging.bind(this)),
					this.renderer.listen(document.body, 'touchend', this.onEndDrag.bind(this))
				];
			else
				this.listeners = [
					this.renderer.listen(document.body, 'mousedown', this.onStartDrag.bind(this)),
					this.renderer.listen(document.body, 'mousemove', this.onDragging.bind(this)),
					this.renderer.listen(document.body, 'mouseup', this.onEndDrag.bind(this)),
				];
		}
		else
			setTimeout(() => this.initSlideDragWatching(), 200);
	}

	private stopSlideDragWatching() {
		if (this.listeners && this.listeners.length)
			this.listeners.forEach((unListen) => unListen());
	}

	private defineContainerWidth() {
		if (this.destroyed)
			return;

		if (!this.windowResizing) {
			let width = 0;
			if (this.sectionEl && this.sectionEl.nativeElement)
				width = this.sectionEl.nativeElement.clientWidth;

			if (width !== this.containerWidth)
				this.containerWidth = width;
		}

		setTimeout(this.defineContainerWidth.bind(this), 100);
	}

	public previewImage(image: any) {
		if (!this.previewRef) {
			this.previewRef = this.helper.openPreview({
				imageUrl: image.lg
			});

			this.previewRef.onClose.subscribe(() => this.previewRef = null);
		}
	}

	public selectImage(imageIndex: number, event) {
		if (imageIndex !== this.currentImageIndex) {
			this.lastDirectionIsRight = imageIndex > this.currentImageIndex;
			this.currentImageIndex = imageIndex;

			if (event.target && this.imageListEl && this.imageListEl.nativeElement)
				this.scrollingToElement(event.target as HTMLElement, this.lastDirectionIsRight);
		}
	}

	public goPrevImage(salt: number = 0) {
		if (this.currentImageIndex > 0) {
			if (salt) {
				if ((this.currentImageIndex - salt) >= 0)
					this.currentImageIndex -= salt + 1;
				else
					this.currentImageIndex = 0;
			}
			else
				this.currentImageIndex--;

			this.lastDirectionIsRight = false;

			let target = this.imageListEl.nativeElement.children[0].children[this.currentImageIndex] as HTMLElement;
			if (this.imageListEl && this.imageListEl.nativeElement)
				this.scrollingToElement(target, this.lastDirectionIsRight);
		}
	}

	public goNextImage(salt: number = 0) {
		if ((this.currentImageIndex + 1) < this.images.length) {
			if (salt) {
				if ((this.currentImageIndex + salt + 1) <= (this.images.length - 1))
					this.currentImageIndex = salt + 1;
				else
					this.currentImageIndex = this.images.length;
			}
			else
				this.currentImageIndex++;

			this.lastDirectionIsRight = true;

			let target = this.imageListEl.nativeElement.children[0].children[this.currentImageIndex] as HTMLElement;
			if (this.imageListEl && this.imageListEl.nativeElement)
				this.scrollingToElement(target, this.lastDirectionIsRight);
		}
	}

	private scrollingToElement(element: HTMLElement, directionIsRight: boolean) {
		let scrollElement = this.imageListEl.nativeElement;
		if (scrollElement && scrollElement.scrollWidth > 0){
			let blockWidth = element.clientWidth + 14;
			let scrollLeft = element.offsetLeft - 14;
			let scrollRight = element.offsetLeft + element.clientWidth + 14;
			let currentScrollLeft = scrollElement.scrollLeft;
			let currentScrollRight = scrollElement.scrollLeft + scrollElement.clientWidth;

			let scroll = .1;

			if (directionIsRight && (currentScrollRight - scrollRight) < Math.floor(blockWidth / 2))
				scroll = currentScrollLeft + blockWidth + 100;
			else if (!directionIsRight && (scrollLeft - currentScrollLeft) < Math.floor(blockWidth / 2))
				scroll = currentScrollLeft - blockWidth;

			if (scroll !== .1) {
				if (this.timerSroll) clearInterval(this.timerSroll);
				this.timerSroll = this.helper.smoothScroll(scrollElement, scroll, 400, 'left');
			}
		}
	}

	public onKeydown(event) {
		if (!this.destroyed && !this.isDragging && [37, 39].indexOf(event.keyCode) >= 0) {
            if (event.keyCode === 37)
                this.goPrevImage();
            else
				this.goNextImage();
				
			if (this.previewRef)
				this.previewRef.instance.onImageChange((this.currentImage as any).lg);
		}
	}

	public onWindowResize() {
		if (!this.destroyed && !this.windowResizing) {
			this.windowResizing = true;
			setTimeout(() => {
				this.containerWidth = this.sectionEl.nativeElement.clientWidth;
				this.windowResizing = false;

				setTimeout(() => {
					if (this.imageListEl && this.imageListEl.nativeElement) {
						let target = this.imageListEl.nativeElement.children[0].children[this.currentImageIndex] as HTMLElement;
						if (this.imageListEl && this.imageListEl.nativeElement)
							this.scrollingToElement(target, this.lastDirectionIsRight);
					}
				}, 100);
			});
		}
	}

	private onStartDrag(event) {
		let isTouching = false;
		if (event.touches) {
			isTouching = true;
			event = event.touches[0];
		}
		
		if (isTouching || event.button === 0) {

			if (this.helper.elementIsChild(event.target, this.sectionEl.nativeElement))
			{
				this.drag.startLeft = this.innerImagesEl.nativeElement.offsetLeft;
				this.drag.currentLeft = this.innerImagesEl.nativeElement.offsetLeft;
				this.drag.startOffset = event.clientX;
				this.drag.currentOffset = event.clientX;
				this.drag.state = 'start';
			}
		}
	}

	private onDragging(event) {
		if (event.touches)
			event = event.touches[0];

		if (this.drag.state === 'start' || this.drag.state === 'dragging') {

			this.drag.state = 'dragging';
			this.drag.currentOffset = event.clientX;

			if (this.drag.startOffset !== this.drag.currentOffset) {
				let draggingRight = this.drag.currentOffset > this.drag.startOffset;
				let delta = Math.abs(this.drag.currentOffset - this.drag.startOffset) * .8;

				if (((draggingRight && this.currentIsFisrt) || (!draggingRight && this.currentIsLast)) && delta > Math.floor(this.containerWidth / 3))
					delta = Math.floor(this.containerWidth / 3);

				this.drag.currentLeft = this.drag.startLeft + ((draggingRight ? 1 : -1) * delta);
			}
			else
				this.drag.currentLeft = this.drag.startLeft;
		}
	}

	private onEndDrag(event) {
		let isTouching = false;
		if (event.touches) {
			isTouching = true;
			event = event.touches[0];
		}
		
		if (isTouching || event.button === 0) {
			let amountDragged = Math.abs(this.drag.startOffset - this.drag.currentOffset);

			if (this.drag.state === 'dragging' && amountDragged > 0)
				setTimeout(() => {
					this.drag.state = 'none';

					let minDreg = 70;

					if (amountDragged >= minDreg) {
						let draggingRight = this.drag.currentOffset > this.drag.startOffset;

						let salts = (amountDragged / this.sectionEl.nativeElement.clientWidth) - 1;
						if (salts >= 1)
							salts = Math.floor(salts);
						else
							salts = 0;

						if (draggingRight && !this.currentIsFisrt)
							this.goPrevImage(salts);
						else if (!draggingRight && !this.currentIsLast)
							this.goNextImage(salts);
					}
				});
			else {
				this.drag.state = 'none';
			}
		}
	}

	ngOnDestroy() {
		this.destroyed = true;
		this.stopSlideDragWatching();
	}

}
