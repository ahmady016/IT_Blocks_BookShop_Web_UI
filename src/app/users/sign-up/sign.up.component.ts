import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from 'src/app/_services/auth.service';
import { DateService } from 'src/app/_services/date.service';
import { User } from 'src/app/_models/user.model';

@Component({
	selector: 'sign-up',
	templateUrl: 'sign.up.component.html',
	styleUrls: ['sign.up.component.css']
})
export class SignUpComponent implements OnInit {
	// the form value
	newUser: User;
	// fill birth date options
	days: string[];
	months: Array<string>[];
	years: string[];
	// Angular Form and its Controls
	signUpForm: FormGroup;
	email: FormControl;
	password: FormControl;
	userName: FormControl;
	address: FormControl;
	mobile: FormControl;
	day: FormControl;
	month: FormControl;
	year: FormControl;
	birthDate: FormControl; // hold the complete birthDate
	gender: FormControl;

	constructor(
		public authSrv: AuthService,
		private dateSrv: DateService,
		private router: Router
	) { }
	private _initForm() {
		// fill Date Options
		this.days = this.dateSrv.Days();
		this.months = this.dateSrv.Months();
		this.years = this.dateSrv.Years(70);

		// build Controls
		this.email = new FormControl("", [Validators.required, Validators.email]);
		this.password = new FormControl("", [Validators.required, Validators.minLength(6)]);
		this.userName = new FormControl("", Validators.required);
		this.address = new FormControl("", Validators.required);
		this.mobile = new FormControl("", Validators.required);
		this.birthDate = new FormControl("", Validators.required);
		this.gender = new FormControl("", Validators.required);
		this.day = new FormControl("", Validators.required);
		this.month = new FormControl("", Validators.required);
		this.year = new FormControl("", Validators.required);

		// build the form
		this.signUpForm = new FormGroup({
			email: this.email,
			password: this.password,
			userName: this.userName,
			address: this.address,
			mobile: this.mobile,
			birthDate: this.birthDate,
			gender: this.gender,
			day: this.day,
			month: this.month,
			year: this.year
		});
	}
	private _isValidDate() {
		if (this.day.value && this.month.value && this.year.value)
			return this.dateSrv.isValidDate(
				+this.day.value,
				+this.month.value,
				+this.year.value
			);
		return false;
	}

	private _setBirthDate() {
		// if the fullDate is valid
		this._isValidDate()
			? this.birthDate.setValue(`${this.day.value}/${this.month.value}/${this.year.value}`)
			: this.birthDate.setValue('');
		// mark the formControl as touched to enable error messages
		this.birthDate.markAsTouched();
	}
	ngOnInit() {
		// build the form and its controls
		this._initForm();
		// manually set form control value based on isValidDate checking method
		this.day.valueChanges.subscribe(v => this._setBirthDate());
		this.month.valueChanges.subscribe(v => this._setBirthDate());
		this.year.valueChanges.subscribe(v => this._setBirthDate());
	}
	signUp() {
		if (this.signUpForm.invalid)
			return;
		// delete the date parts field from the new customer [exist only for formControls]
		delete this.signUpForm.value.day;
		delete this.signUpForm.value.month;
		delete this.signUpForm.value.year;
		// add the new Customer
		this.newUser = this.signUpForm.value;
		this.authSrv.register(this.newUser)
			.subscribe(
				_ => void this.router.navigate(["/books"]),
				console.log
			);
		// reset the form
		this.signUpForm.reset();
		this.birthDate.markAsUntouched();
	}
}
