export interface Author {
  authorId?: number;
  authorName: string;
  birthDate?: Date | string;
  userId?: number | null;
  isDeleted?: boolean;
}
