import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { env } from '../../environments/environment';
import { AuthUser, PurchaseOrder, BorrowingOrder } from 'src/app/_models';
import LS from '../localStorage';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private currentUser: AuthUser = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.currentUser = LS.get('currentUser');
  }

  private showSuccess(actionType: string): void {
    this.toastr.success(`your ${actionType} completed successfully ...`);
  }

  doPurchase(purchase: PurchaseOrder) {
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
