import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { env } from '../../environments/environment';
import { DateService } from './date.service';
import { AuthUser, PurchaseOrder, BorrowingOrder, Customer } from 'src/app/_models';
import LS from '../localStorage';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private currentUser: AuthUser = null;
  public currentCustomer: Customer = null;

  constructor(
    private http: HttpClient,
    private dateSrv: DateService,
    private toastr: ToastrService
  ) {
    this.currentUser = LS.get('currentUser');
  }

  private showSuccess(actionType: string): void {
    this.toastr.success(`your ${actionType} completed successfully ...`);
  }

  getCustomer(customerId: string) {
    return this.http.get<Customer>(`${env.API_URL}/customers/${customerId}`)
      .pipe(
        map(customer => {
          this.currentCustomer = customer;
          return customer;
        })
      )
  }

  doPurchase(purchase: PurchaseOrder) {
    purchase.purchaseDate = this.dateSrv.toSqlFormat(purchase.purchaseDate as string);
    if(this.currentUser)
      purchase.userId = this.currentUser.user.userId;

    return this.http.post<any>(`${env.API_URL}/purchases/add`, purchase)
      .pipe(
        map(purchase => {
          this.showSuccess('purchase');
          return purchase;
        })
      );
  }

  doBorrowing(borrowing: BorrowingOrder) {
    borrowing.borrowingStartDate = this.dateSrv.toSqlFormat(borrowing.borrowingStartDate as string);
    borrowing.borrowingEndDate = this.dateSrv.toSqlFormat(borrowing.borrowingEndDate as string);

    if(this.currentUser)
      borrowing.userId = this.currentUser.user.userId;

    return this.http.post<any>(`${env.API_URL}/borrowings/add`, borrowing)
      .pipe(
        map(borrowing => {
          this.showSuccess('borrowing');
          return borrowing;
        })
      );
  }

}
