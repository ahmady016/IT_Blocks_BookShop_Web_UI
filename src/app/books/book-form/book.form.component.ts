import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BookService } from './../../services/book.service';
import { DateService } from './../../services/date.service';
import { Book } from '../../models/Book.model';

@Component({
	selector: 'book-form',
	templateUrl: 'book.form.component.html',
	styleUrls: ['book.form.component.css']
})
export class BookFormComponent implements OnInit {
	// readonly controls
	readonly: boolean = false;
	// edit mode
	edit: boolean = false;
	// hold the route param
	bookId: number = 0;
	// the form value
	newBook: Book;
	// publishedDate options
	days: string[];
	months: Array<string>[];
	years: string[];
	// Angular Form and its Controls
	bookForm: FormGroup;
	fields: any = {
		title: FormControl,
		subtitle: FormControl,
		description: FormControl,
		thumbnailUrl: FormControl,
		pageCount: FormControl,
		inventoryCount: FormControl,
		unitPrice: FormControl,
		day: FormControl,
		month: FormControl,
		year: FormControl,
		publishedDate: FormControl // hold the complete publishedDate
	}

	constructor(
		private bookSrv: BookService,
		private dateSrv: DateService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.route.params.subscribe(route => {
			if (route.bookId) {
				this.bookId = +route.bookId;
				this.bookSrv.find(route.bookId)
					.subscribe(
						_ => {
							// create the book Form with its values
							this.createForm(this.bookSrv.currentBook);
							// manually set publishedDate value on each date parts change
							this.fields.day.valueChanges.subscribe(v => this._setPublishedDate());
							this.fields.month.valueChanges.subscribe(v => this._setPublishedDate());
							this.fields.year.valueChanges.subscribe(v => this._setPublishedDate());
						},
						console.log
					);
			}
			if (route.type === 'view')
				this.readonly = true;
			else if (route.type === 'edit')
				this.edit = true;
		});
	}

	createForm(book: Book) {
		// fill Date Options
		this.days = this.dateSrv.Days();
		this.months = this.dateSrv.Months();
		this.years = this.dateSrv.Years(70);
		// build form fields
		this.fields.title = new FormControl(
			{ value: (book) ? book.title : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.subtitle = new FormControl(
			{ value: (book) ? book.subtitle : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.description = new FormControl(
			{ value: (book) ? book.description : '', disabled: this.readonly })

		this.fields.thumbnailUrl = new FormControl(
			{ value: (book) ? book.thumbnailUrl : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.pageCount = new FormControl(
			{ value: (book) ? book.pageCount : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.inventoryCount = new FormControl(
			{ value: (book) ? book.inventoryCount : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.unitPrice = new FormControl(
			{ value: (book) ? book.unitPrice : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.day = new FormControl(
			{ value: (book) ? new Date(book.publishedDate).getDate() : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.month = new FormControl(
			{ value: (book) ? new Date(book.publishedDate).getMonth() : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.year = new FormControl(
			{ value: (book) ? new Date(book.publishedDate).getFullYear() : '', disabled: this.readonly },
			Validators.required
		);
		this.fields.publishedDate = new FormControl(
			{ value: (book) ? book.publishedDate : '', disabled: this.readonly },
			Validators.required
		);
		// build Angular Form
		this.bookForm = new FormGroup({ ...this.fields });
	}

	private _isValidDate() {
		if (this.fields.day.value && this.fields.month.value && this.fields.year.value)
			return this.dateSrv.isValidDate(
				+this.fields.day.value,
				+this.fields.month.value,
				+this.fields.year.value
			);
		return false;
	}

	private _setPublishedDate() {
		// if the fullDate is valid
		this._isValidDate()
			? this.fields.publishedDate.setValue(`${this.fields.day.value}/${this.fields.month.value}/${this.fields.year.value}`)
			: this.fields.publishedDate.setValue('');
		// mark the formControl as touched to enable error messages
		this.fields.publishedDate.markAsTouched();
	}

	save() {
		if (this.bookForm.invalid)
			return;

		// delete the date parts field from the formControls
		delete this.bookForm.value.day;
		delete this.bookForm.value.month;
		delete this.bookForm.value.year;
		// add the newBook
		this.newBook = this.bookForm.value;

		if (this.bookId) {
			this.newBook.bookId = this.bookId;
			this.bookSrv.update(this.newBook)
				.subscribe(
					_ => void this.router.navigate(["/books"]),
					console.log
				);
		}
		else
			this.bookSrv.add(this.newBook)
				.subscribe(
					_ => void this.router.navigate(["/books"]),
					console.log
				);
	}

	cancel() {
		this.router.navigate(['books']);
	}
}
