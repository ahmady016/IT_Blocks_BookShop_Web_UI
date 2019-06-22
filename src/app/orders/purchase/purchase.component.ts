import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
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

	private _setCustomerName(customerName: string) {
		if (customerName) {
			this.fields.customerName.setValue(customerName);
			this.fields.customerName.disable();
			this.fields.customerName.markAsTouched();
		} else {
			this.fields.customerName.setValue(customerName);
			this.fields.customerName.enable();
			this.fields.customerName.markAsUntouched();
		}
	}

	private _createForm() {
		// build form fields
		this.fields.purchaseDate = new FormControl('', Validators.required);
		this.fields.quantity = new FormControl('', Validators.required);
		this.fields.paidAmount = new FormControl('', Validators.required);
		this.fields.customerId = new FormControl('', Validators.required);
		this.fields.customerName = new FormControl('', Validators.required);
		// build Angular Form
		this.purchaseForm = new FormGroup({ ...this.fields });
	}

	setPurchaseDate() {
		(this.purchaseDate)
			? this.fields.purchaseDate.setValue(`${this.purchaseDate.day}/${this.purchaseDate.month}/${this.purchaseDate.year}`)
			: this.fields.purchaseDate.setValue('')
		this.fields.purchaseDate.markAsTouched();
	}

	ngOnInit(): void {
		this._createForm();
		// listen from customerId changes
		this.fields.customerId.valueChanges
			.pipe(
				debounceTime(1000),
				distinctUntilChanged()
			)
			.subscribe(value => {
				if (!value)
					this._setCustomerName('')
				else if (value.length === 14) {
					this.orderSrv.getCustomer(value)
						.subscribe(
							_ => {
								if (this.orderSrv.currentCustomer)
									this._setCustomerName(this.orderSrv.currentCustomer.customerName)
							},
							console.log
						)
				}
			})
	}

	doPurchase() {
		if (this.purchaseForm.invalid || !this.bookId)
			return;
		// build the purchase order
		this.purchaseOrder = {
			purchaseDate: this.purchaseForm.value.purchaseDate,
			quantity: this.purchaseForm.value.quantity,
			paidAmount: this.purchaseForm.value.paidAmount,
			bookId: this.bookId
		};
		if (this.orderSrv.currentCustomer) {
			this.purchaseOrder.customerId = this.orderSrv.currentCustomer.customerId;
		} else {
			this.purchaseOrder.customer = {
				customerId: this.purchaseForm.value.customerId,
				customerName: this.purchaseForm.value.customerName
			};
		}
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
