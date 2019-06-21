export interface Customer {
  customerId?: string;
  customerName: string;
  birthDate?: Date | string;
  userId?: number;
  isDeleted?: boolean;
}
