import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from 'src/app/_services/auth.service';

@Component({
	selector: 'sign-in',
	templateUrl: 'sign.in.component.html',
	styleUrls: ['sign.in.component.css']
})
export class SignInComponent implements OnInit {

	error: boolean = false;
	signInForm: FormGroup;
	email: FormControl;
	password: FormControl;

	constructor(
		public authSrv: AuthService,
		private router: Router
	) { }

	initForm() {
		this.email = new FormControl("", [Validators.required, Validators.email]);
		this.password = new FormControl("", [Validators.required, Validators.minLength(6)]);
		this.signInForm = new FormGroup({
			email: this.email,
			password: this.password
		});
	}

	ngOnInit() {
		this.initForm();
	}
	signIn(e) {
		e.preventDefault();
		if (this.signInForm.invalid)
			return;
		this.authSrv.login(this.signInForm.value.email, this.signInForm.value.password)
			.subscribe(
				_ => void this.router.navigate(["/books"]),
				error => void (this.error = true)
			);
		this.signInForm.reset();
	}
}
