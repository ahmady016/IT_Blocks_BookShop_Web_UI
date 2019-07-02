import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/_services';

@Component({
	selector: 'app-header',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.css']
})
export class HeaderComponent {

	title: string = 'IT Blocks BookShop'
	showNavItems: boolean = true

	constructor(
		private authSrv: AuthService,
		private router: Router
	) { }

	signOut() {
		this.authSrv.logout();
		this.router.navigate(["/sign-in"]);
	}

	navItemsToggle() {
		this.showNavItems = !this.showNavItems;
		console.log("TCL: HeaderComponent -> navItemsToggle -> showNavItems", this.showNavItems)
	}

}
