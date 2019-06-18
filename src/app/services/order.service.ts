import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { env } from '../../environments/environment';
import { PurchaseOrder, BorrowingOrder } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private orderSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.orderSubject = new BehaviorSubject<string>('');
  }

  public get books(): string {
    return this.orderSubject.value;
  }

  doPurchase(purchase: PurchaseOrder) {
    return this.http.post<any>(`${env.API_URL}/purchase/add`, purchase)
      .pipe(
        map(purchase => {
          this.orderSubject.next('your purchase completed successfully ...');
          return purchase;
        }),
        catchError(err => of({ err }))
      );
  }

  doBorrowing(borrowing: BorrowingOrder) {
    return this.http.post<any>(`${env.API_URL}/borrowing/add`, borrowing)
      .pipe(
        map(borrowing => {
          this.orderSubject.next('your borrowing completed successfully ...');
          return borrowing;
        }),
        catchError(err => of({ err }))
      );
  }

}
