export interface Customer {
  customerId?: number;
  customerName: string;
  birthDate?: Date | string;
  userId?: number;
  isDeleted?: boolean;
}
