import { Component } from '@angular/core';

import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { BookService } from 'src/app/_services';

@Component({
	selector: 'books-slider',
	templateUrl: 'books.slider.component.html',
	styleUrls: ['books.slider.component.css']
})
export class BooksSliderComponent {
	constructor(
		private bookSrv: BookService,
		public config: NgbCarouselConfig
	) {
		config.keyboard = true;
		config.pauseOnHover = true;
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
		// get all existing books
		if (!this.bookSrv.books.length)
			this.bookSrv.find()
				.subscribe(
					console.log,
					console.log
				)
	}
}