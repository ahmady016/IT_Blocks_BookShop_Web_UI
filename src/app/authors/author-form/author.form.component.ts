import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthorService, DateService } from 'src/app/_services';
import { Author } from 'src/app/_models';

@Component({
	selector: 'author-form',
	templateUrl: 'author.form.component.html',
	styleUrls: ['author.form.component.css']
})
export class AuthorFormComponent implements OnInit {
	// readonly controls
	readonly: boolean = false;
	// edit mode
	edit: boolean = false;
	// hold the route param
	authorId: number = 0;
	// the form value
	newAuthor: Author;
	// birthDate options
	days: string[];
	months: Array<string>[];
	years: string[];
	// Angular Form and its Controls
	authorForm: FormGroup;
	fields: any = {
		authorName: FormControl,
		day: FormControl,
		month: FormControl,
		year: FormControl,
		birthDate: FormControl // hold the complete birthDate
	}

	constructor(
		private authorSrv: AuthorService,
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

			this.authorId = +route.authorId;
			if (this.authorId) {
				this.authorSrv.find(route.authorId)
					.subscribe(
						author => void this._setFormValues(author),
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
		this.fields.authorName = new FormControl(
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
		this.fields.birthDate = new FormControl(
			{ value: '', disabled: this.readonly },
			Validators.required
		);
		// build Angular Form
		this.authorForm = new FormGroup({ ...this.fields });
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

	private _setBirthDate() {
		// if the fullDate is valid
		this._isValidDate()
			? this.fields.birthDate.setValue(`${this.fields.day.value}/${this.fields.month.value}/${this.fields.year.value}`)
			: this.fields.birthDate.setValue('');
		// mark the formControl as touched to enable error messages
		this.fields.birthDate.markAsTouched();
	}

	private _initForm() {
		// create the author Form with its values
		this._createForm();
		// manually set publishedDate value on each date parts change
		this.fields.day.valueChanges.subscribe(v => this._setBirthDate());
		this.fields.month.valueChanges.subscribe(v => this._setBirthDate());
		this.fields.year.valueChanges.subscribe(v => this._setBirthDate());
	}

	private _setFormValues(author: Author) {
		this.fields.title.setValue(author.authorName)
		this.fields.day.setValue(new Date(author.birthDate).getDate() )
		this.fields.month.setValue(new Date(author.birthDate).getMonth() )
		this.fields.year.setValue(new Date(author.birthDate).getFullYear() )
		this.fields.publishedDate.setValue(author.birthDate)
	}

	save() {
		if (this.authorForm.invalid)
			return;

		// delete the date parts field from the formControls
		delete this.authorForm.value.day;
		delete this.authorForm.value.month;
		delete this.authorForm.value.year;
		// add the newAuthor
		this.newAuthor = this.authorForm.value;

		if (this.authorId) {
			this.newAuthor.authorId = this.authorId;
			this.authorSrv.update(this.newAuthor)
				.subscribe(
					_ => void this.router.navigate(["/authors"]),
					console.log
				);
		}
		else
			this.authorSrv.add(this.newAuthor)
				.subscribe(
					_ => void this.router.navigate(["/authors"]),
					console.log
				);
	}

	cancel() {
		this.router.navigate(['authors']);
	}
}
