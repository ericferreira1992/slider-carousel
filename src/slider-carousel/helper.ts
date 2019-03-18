import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { SliderCarouselPreviewComponent } from './slider-carousel-preview/slider-carousel-preview.component';

@Injectable()
export class Helper {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) {

    }
	
	public openPreview(data: { [key: string]: any } = {}) {
        let onCloseSubscribe: Subscriber<any>;
		let object: {
            onClose: Observable<any>,
            instance: SliderCarouselPreviewComponent
        };

        object = {
            onClose: new Observable((subscribe) => onCloseSubscribe = subscribe),
            instance: null
        };

        let componenRef = this.createComponent(SliderCarouselPreviewComponent, data, (data) => {
            onCloseSubscribe.next(data);
        });
        object.instance = (componenRef as ComponentRef<SliderCarouselPreviewComponent>).instance;

        return object;
    }
    
    public createComponent(component: any, data, onClose: (data) => void) {
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

        if (!data) data = {};

        data.close = (data) => {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
            if (onClose) onClose(data);
        };
        
        Object.assign(componentRef.instance, { modalRef: data });

        this.appRef.attachView(componentRef.hostView);
        
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        
        document.body.appendChild(domElem);

        return componentRef;
    }

    public smoothScroll(element: HTMLElement, scroll: number, duration: number = 400, direction: string = 'top') {
		let start = direction === 'top' ? element.scrollTop : element.scrollLeft;

		if (scroll < 0) scroll = 0;

		let distance = (scroll - start) - 77;

		let startTime = new Date().getTime();

		if (!duration) duration = 400;

		let easeInOutQuart = (time, from, distance, duration) => {
			if ((time /= duration / 2) < 1)
				return distance / 2 * time * time * time * time + from;
			return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
		};

		let timer = setInterval(() => {
			const time = new Date().getTime() - startTime,
			newScroll = easeInOutQuart(time, start, distance, duration);

			if (time >= duration) {
				clearInterval(timer);
				timer = null;
			}

			if (element.scrollTo) {
				if (direction === 'top')
					element.scrollTo(element.scrollLeft, newScroll);
				else
					element.scrollTo(newScroll, element.scrollTop);
			}
			else {
				if (direction === 'top')
					element.scrollTop = newScroll;
				else
					element.scrollLeft = newScroll;
			}
		}, 1000 / 60);

		return timer;
	}
}