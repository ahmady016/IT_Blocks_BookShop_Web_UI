import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'

import { OrderService } from 'src/app/_services';
import { BorrowingOrder } from 'src/app/_models';

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

	startDate: NgbDateStruct;
	endDate: NgbDateStruct;

	constructor(
		private orderSrv: OrderService,
		private router: Router,
		private route: ActivatedRoute
	) {
		// get the bookId from route params
		this.route.params.subscribe(route => {
			if (route.bookId)
				this.bookId = +route.bookId;
		});
	}

	private _setCustomerName(customerName: string) {
		this.fields.customerName.setValue(customerName);
		this.fields.customerName.markAsTouched();
	}

	private _createForm() {
		// build form fields
		this.fields.borrowingStartDate = new FormControl('', Validators.required);
		this.fields.borrowingEndDate = new FormControl('', Validators.required);
		this.fields.customerId = new FormControl('', Validators.required);
		this.fields.customerName = new FormControl('', Validators.required);
		// build Angular Form
		this.borrowingForm = new FormGroup({ ...this.fields });
	}

	setDateField(type: string) {
		if (type === 'start') {
			(this.startDate)
				? this.fields.borrowingStartDate.setValue(`${this.startDate.day}/${this.startDate.month}/${this.startDate.year}`)
				: this.fields.borrowingStartDate.setValue('')
			this.fields.borrowingStartDate.markAsTouched();
		} else {
			(this.endDate)
				? this.fields.borrowingEndDate.setValue(`${this.endDate.day}/${this.endDate.month}/${this.endDate.year}`)
				: this.fields.borrowingEndDate.setValue('')
			this.fields.borrowingEndDate.markAsTouched();
		}
	}

	ngOnInit(): void {
		this._createForm();
		// listen from customerId changes
		this.fields.customerId.valueChanges
			.pipe(
				debounceTime(1000),
				distinctUntilChanged(),
				filter((value: string) => value.length === 14)
			)
			.subscribe(value => {
				this.orderSrv.getCustomer(value)
					.subscribe(
						_ => {
							if (this.orderSrv.currentCustomer)
								this._setCustomerName(this.orderSrv.currentCustomer.customerName)
						},
						console.log
					)
			})
	}

	doBorrowing() {
		if (this.borrowingForm.invalid || !this.bookId)
			return;
		// build the borrowing order
		if (this.orderSrv.currentCustomer) {
			this.borrowingOrder = {
				borrowingStartDate: this.borrowingForm.value.borrowingStartDate,
				borrowingEndDate: this.borrowingForm.value.borrowingEndDate,
				bookId: this.bookId,
				customerId: this.orderSrv.currentCustomer.customerId
			}
		} else {
			this.borrowingOrder = {
				borrowingStartDate: this.borrowingForm.value.borrowingStartDate,
				borrowingEndDate: this.borrowingForm.value.borrowingEndDate,
				bookId: this.bookId,
				customer: {
					customerId: this.borrowingForm.value.customerId,
					customerName: this.borrowingForm.value.customerName
				}
			};
		}
		// save the borrowing order
		this.orderSrv.doBorrowing(this.borrowingOrder)
			.subscribe(
				_ => this.router.navigate(["/books"]),
				console.log
			);
	}

	cancel() {
		this.router.navigate(['books']);
	}
}
