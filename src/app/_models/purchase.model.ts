export interface Purchase {
  purchaseId?: number;
  purchaseDate?: Date | string;
  quantity: number;
  paidAmount: number;
  bookId?: number;
  customerId?: number;
  userId?: number;
  isDeleted?: boolean;
}
