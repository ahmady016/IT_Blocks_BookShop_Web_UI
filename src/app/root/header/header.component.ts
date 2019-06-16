import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.css']
})
export class HeaderComponent {
	title: string = 'IT Blocks BookShop'
	constructor(private AuthSrv: AuthService,
		private router: Router) { }
	signOut() {
		this.AuthSrv.logout();
		this.router.navigate(["/sign-in"]);
	}
}
