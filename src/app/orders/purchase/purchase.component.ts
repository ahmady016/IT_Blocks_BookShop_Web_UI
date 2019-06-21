import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from 'src/app/_services';
import { PurchaseOrder } from 'src/app/_models';

@Component({
	selector: 'purchase',
	templateUrl: 'purchase.component.html',
	styleUrls: ['purchase.component.css']
})

export class PurchaseComponent implements OnInit {

	bookId: number;
	purchaseOrder: PurchaseOrder;
	fields: any = {
		purchaseDate: FormControl,
		quantity: FormControl,
		paidAmount: FormControl,
		customerId: FormControl,
		customerName: FormControl
	}
	purchaseForm: FormGroup;
	purchaseDate: NgbDateStruct;

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
		this.fields.purchaseDate = new FormControl('', Validators.required);
		this.fields.quantity = new FormControl('', Validators.required);
		this.fields.paidAmount = new FormControl('', Validators.required);
		this.fields.customerId = new FormControl('', Validators.required);
		this.fields.customerName = new FormControl('', Validators.required);
		// build Angular Form
		this.purchaseForm = new FormGroup({ ...this.fields });
	}

	ngOnInit(): void {
		this.createForm();
	}

	setPurchaseDate() {
		(this.purchaseDate)
			? this.fields.purchaseDate.setValue(`${this.purchaseDate.day}/${this.purchaseDate.month}/${this.purchaseDate.year}`)
			: this.fields.purchaseDate.setValue('')
		this.fields.purchaseDate.markAsTouched();
	}

	doPurchase() {
		if (this.purchaseForm.invalid || !this.bookId)
			return;
		// add the newBoo
		this.purchaseOrder = {
			purchaseDate: this.purchaseForm.value.purchaseDate,
			quantity: this.purchaseForm.value.quantity,
			paidAmount: this.purchaseForm.value.paidAmount,
			bookId: this.bookId,
			customer: {
				customerId: this.purchaseForm.value.customerId,
				customerName: this.purchaseForm.value.customerName
			}
		};
		// save the purchase order
		this.orderSrv.doPurchase(this.purchaseOrder)
			.subscribe(
				_ => this.router.navigate(["/books"]),
				console.log
			);
	}

	cancel() {
		this.router.navigate(['books']);
	}
}
