import { Customer } from './customer.model';

export interface PurchaseOrder {
  purchaseId?: number;
  purchaseDate?: Date | string;
  quantity: number;
  paidAmount: number;
  bookId?: number;
  userId?: number;
  customerId?: string | null;
  customer?: Customer;
}

export interface BorrowingOrder {
  borrowingId?: number;
  borrowingStartDate: Date | string;
  borrowingEndDate: Date | string;
  bookId?: number | null;
  userId?: number | null;
  customerId?: string | null;
  customer?: Customer;
}
