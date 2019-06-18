import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { OrderService } from './../../services/order.service';
import { BorrowingOrder } from '../../models/order.model';

@Component({
	selector: 'borrowing',
	templateUrl: 'borrowing.component.html',
	styleUrls: ['borrowing.component.css']
})
export class BorrowingComponent implements OnInit {

	bookId: number;
	borrowingOrder: BorrowingOrder;
	fields: any = {
		borrowingStartDate: FormControl,
		borrowingEndDate: FormControl,
		customerId: FormControl,
		customerName: FormControl
	}
	borrowingForm: FormGroup;

	constructor(
		private orderSrv: OrderService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.route.params.subscribe(route => {
			if (route.bookId)
				this.bookId = +route.bookId;
		});
	}

	createForm() {
		// build form fields
		this.fields.borrowingStartDate = new FormControl('', Validators.required);
		this.fields.borrowingEndDate = new FormControl('', Validators.required);
		this.fields.customerId = new FormControl('', Validators.required);
		this.fields.customerName = new FormControl('', Validators.required);
		// build Angular Form
		this.borrowingForm = new FormGroup({ ...this.fields });
	}

	ngOnInit(): void {
		this.createForm();
	}

	doBorrowing() {
		if (this.borrowingForm.invalid || !this.bookId)
			return;
		// add the newBoo
		this.borrowingOrder = {
			borrowingStartDate: this.borrowingForm.value.borrowingStartDate,
			borrowingEndDate: this.borrowingForm.value.borrowingEndDate,
			bookId: this.bookId,
			customer: {
				customerId: this.borrowingForm.value.customerId,
				customerName: this.borrowingForm.value.customerName
			}
		};
		// save the purchase order
		this.orderSrv.doBorrowing(this.borrowingOrder)
			.subscribe(
				_ => void this.router.navigate(["/books"]),
				console.log
			);
		// reset the form
		this.borrowingForm.reset();
		// go back to books
		this.router.navigate(['books']);
	}

	cancel() {
		this.router.navigate(['books']);
	}
}
