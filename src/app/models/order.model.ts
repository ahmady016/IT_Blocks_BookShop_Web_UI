import { Customer } from './customer.model';
import { Borrowing } from './borrowing.model';

export interface PurchaseOrder {
  purchaseId?: number;
  purchaseDate?: Date | string;
  quantity: number;
  paidAmount: number;
  bookId?: number;
  userId?: number;
  customer: Customer;
}

export interface BorrowingOrder {
  borrowingId?: number;
  borrowingStartDate: Date | string;
  borrowingEndDate: Date | string;
  bookId?: number | null;
  customerId?: number | null;
  userId?: number | null;
  customer: Customer;
}
