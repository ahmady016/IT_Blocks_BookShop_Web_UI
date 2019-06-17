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
		thumbnailURL: FormControl,
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
	) {
		this.route.params.subscribe(route => {
			if (route.bookId) {
				this.bookId = route.bookId;
				this.bookSrv.find(route.bookId);
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
		this.fields.title = new FormControl((book) ? book.title : '', Validators.required);
		this.fields.subtitle = new FormControl((book) ? book.subtitle : '', Validators.required);
		this.fields.description = new FormControl((book) ? book.description : '');
		this.fields.thumbnailURL = new FormControl((book) ? book.thumbnailURL : '', Validators.required);
		this.fields.pageCount = new FormControl((book) ? book.pageCount : '', Validators.required);
		this.fields.inventoryCount = new FormControl((book) ? book.inventoryCount : '', Validators.required);
		this.fields.unitPrice = new FormControl((book) ? book.unitPrice : '', Validators.required);
		this.fields.day = new FormControl((book) ? new Date(book.publishedDate).getDate() : '', Validators.required);
		this.fields.month = new FormControl((book) ? new Date(book.publishedDate).getMonth() : '', Validators.required);
		this.fields.year = new FormControl((book) ? new Date(book.publishedDate).getFullYear() : '', Validators.required);
		this.fields.publishedDate = new FormControl((book) ? book.publishedDate : '', Validators.required);
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

	ngOnInit(): void {
		this.createForm(this.bookSrv.currentBook);
		// manually set publishedDate value on each date parts change
		this.fields.day.valueChanges.subscribe(v => this._setPublishedDate());
		this.fields.month.valueChanges.subscribe(v => this._setPublishedDate());
		this.fields.year.valueChanges.subscribe(v => this._setPublishedDate());
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

		if (this.bookId)
			this.bookSrv.update(this.newBook);
		else
			this.bookSrv.add(this.newBook);

		this.bookForm.reset();
		this.router.navigate(['books']);
	}

	cancel() {
		this.router.navigate(['books']);
	}
}
