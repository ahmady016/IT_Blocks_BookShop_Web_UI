import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { BookService, OrderService } from 'src/app/_services';
import { Book } from 'src/app/_models';

@Component({
	selector: 'book-list',
	templateUrl: 'book.list.component.html',
	styleUrls: ['book.list.component.css']
})

export class BookListComponent implements OnInit {

	// Angular Form and its Controls
	searchForm: FormGroup;
	fields: any = {
		booksQuery: FormControl
	}

	constructor(
		public bookSrv: BookService,
		public orderSrv: OrderService
	) { }

	ngOnInit(): void {
		// build form fields
		this.fields.booksQuery = new FormControl('');
		// build Angular Form
		this.searchForm = new FormGroup({ ...this.fields });
		// get all existing books
		this.bookSrv.find()
			.subscribe(
				console.log,
				console.log
			)
		// values changes listener
		this.fields.booksQuery.valueChanges
			.pipe(
				debounceTime(1000),
				distinctUntilChanged()
			)
			.subscribe(value => {
				if (value === '')
					// get all existing books
					this.bookSrv.find()
						.subscribe(
							console.log,
							console.log
						)
				else
					this.bookSrv.query(value)
						.subscribe(
							console.log,
							console.log
						)
			});
	}

	removeBook(book: Book) {
		if (confirm('are you sure you want to delete this book?'))
			this.bookSrv.delete('logical', book)
				.subscribe(
					console.log,
					console.log
				);
	}
}
