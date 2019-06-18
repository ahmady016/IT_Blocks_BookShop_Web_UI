import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { env } from '../../environments/environment';
import { PurchaseOrder, BorrowingOrder } from '../models/order.model';
import { AuthUser } from './../models/user.model';
import LS from '../localStorage';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private orderSubject: BehaviorSubject<string>;
  private currentUser: AuthUser = null;
  public orderError: any = null;

  constructor(private http: HttpClient) {
    this.orderSubject = new BehaviorSubject<string>('');
    this.currentUser = LS.get('currentUser');
  }

  public get orderStatus(): string {
    return this.orderSubject.value;
  }

  private setOrderStatus(actionType: string): void {
    this.orderSubject.next(`your ${actionType} completed successfully ...`);
    setTimeout(() => this.orderSubject.next(''), 5000)
  }

  doPurchase(purchase: PurchaseOrder) {
    if(this.currentUser)
      purchase.userId = this.currentUser.user.userId;

    console.log("TCL: OrderService -> doPurchase -> purchase", purchase);

    return this.http.post<any>(`${env.API_URL}/purchases/add`, purchase)
      .pipe(
        map(purchase => {
          this.setOrderStatus('purchase');
          return purchase;
        }),
        catchError(res => {
          this.orderError = res.error
          return of(res.error)
        })
      );
  }

  doBorrowing(borrowing: BorrowingOrder) {
    if(this.currentUser)
      borrowing.userId = this.currentUser.user.userId;
    return this.http.post<any>(`${env.API_URL}/borrowings/add`, borrowing)
      .pipe(
        map(borrowing => {
          this.setOrderStatus('borrowing');
          return borrowing;
        }),
        catchError(res => {
          this.orderError = res.error
          return of(res.error)
        })
      );
  }

}
