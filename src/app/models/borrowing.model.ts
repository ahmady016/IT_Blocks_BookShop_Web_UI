export interface Borrowing {
  borrowingId?: number;
  borrowingStartDate: Date | string;
  borrowingEndDate: Date | string;
  bookId?: number | null;
  customerId?: number | null;
  userId?: number | null;
  isDeleted?: boolean;
}
