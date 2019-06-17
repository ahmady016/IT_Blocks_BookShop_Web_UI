import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { BookService } from './../../services/book.service';
import { Book } from './../../models/book.model';

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
		private router: Router
	) { }

	ngOnInit(): void {
		// build form fields
		this.fields.booksQuery = new FormControl('');
		// build Angular Form
		this.searchForm = new FormGroup({ ...this.fields });
		// values changes listener
		this.fields.booksQuery.valueChanges
			.pipe(
				filter(Boolean),
				debounceTime(1000),
				distinctUntilChanged()
			)
			.subscribe(value => this.bookSrv.query(value));
	}

	removeBook(book: Book) {
		if (confirm('are you sure you want to delete this book?'))
			this.bookSrv.delete('logical', book)
	}
}
