export interface Book {
  bookId?: number;
  title: string;
  subtitle: string;
  publishedDate?: Date | string;
  thumbnailUrl: string;
  pageCount: number;
  description?: string;
  authors: string;
  inventoryCount: number;
  unitPrice: number;
  userId?: number;
  isDeleted?: boolean;
}
