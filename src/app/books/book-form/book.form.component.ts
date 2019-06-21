import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BookService, DateService } from 'src/app/_services';
import { Book } from 'src/app/_models';

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
		this._initForm();
		this.route.params.subscribe(route => {
			if (route.type === 'view')
				this.readonly = true;
			else if (route.type === 'edit')
				this.edit = true;

			this.bookId = +route.bookId;
			if (this.bookId) {
				this.bookSrv.find(route.bookId)
					.subscribe(
						book => void this._setFormValues(book),
						console.log
					);
			}
		});
	}

	private _createForm() {
		// fill Date Options
		this.days = this.dateSrv.Days();
		this.months = this.dateSrv.Months();
		this.years = this.dateSrv.Years(70);
		// build form fields
		this.fields.title = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.subtitle = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.description = new FormControl(
			{ value: '', disabled: this.readonly })

		this.fields.thumbnailUrl = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.pageCount = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.inventoryCount = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.unitPrice = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.day = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.month = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.year = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		this.fields.publishedDate = new FormControl(
			{ value: '', disabled: this.readonly },
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

	private _initForm() {
		// create the book Form with its values
		this._createForm();
		// manually set publishedDate value on each date parts change
		this.fields.day.valueChanges.subscribe(v => this._setPublishedDate());
		this.fields.month.valueChanges.subscribe(v => this._setPublishedDate());
		this.fields.year.valueChanges.subscribe(v => this._setPublishedDate());
	}

	private _setFormValues(book: Book) {
		this.fields.title.setValue(book.title)
		this.fields.subtitle.setValue(book.subtitle)
		this.fields.description.setValue(book.description)
		this.fields.thumbnailUrl.setValue(book.thumbnailUrl)
		this.fields.pageCount.setValue(book.pageCount)
		this.fields.inventoryCount.setValue(book.inventoryCount)
		this.fields.unitPrice.setValue(book.unitPrice)
		this.fields.day.setValue(new Date(book.publishedDate).getDate() )
		this.fields.month.setValue(new Date(book.publishedDate).getMonth() )
		this.fields.year.setValue(new Date(book.publishedDate).getFullYear() )
		this.fields.publishedDate.setValue(book.publishedDate)
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
