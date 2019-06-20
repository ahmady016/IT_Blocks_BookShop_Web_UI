import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { env } from '../../environments/environment';
import { DateService } from './date.service';
import { Book } from 'src/app/_models/book.model';
import { AuthUser } from 'src/app/_models/user.model';
import LS from '../localStorage';

@Injectable({ providedIn: 'root' })
export class BookService {

  private currentUser: AuthUser = null;
  private booksSubject: BehaviorSubject<Book[]>;
  private currentBookSubject: BehaviorSubject<Book>;
  public $books: Observable<Book[]>;

  constructor(
    private http: HttpClient,
    private dateSrv: DateService
  ) {
    this.booksSubject = new BehaviorSubject<Book[]>([]);
    this.currentBookSubject = new BehaviorSubject<Book>(null);
    this.$books = this.booksSubject.asObservable();
    this.currentUser = LS.get('currentUser');
  }

  public get books(): Book[] {
    return this.booksSubject.value;
  }

  public get currentBook(): Book {
    return this.currentBookSubject.value;
  }

  private setCurrentBook(bookId: number) {
    this.currentBookSubject.next(this.booksSubject.value.find(book => book.bookId === bookId));
  }

  query(value: string) {
    return this.http.get<Book[]>(`${env.API_URL}/books/query?filters=title|%|${value}`)
      .pipe(
        map(books => {
          this.booksSubject.next(books);
          return books;
        }),
        catchError(err => of({ err }))
      );
  }

  find(bookId?: number): any {
    if (!bookId) {
      return this.http.get<Book[]>(`${env.API_URL}/books/list/existing`)
        .pipe(
          map(books => {
            this.booksSubject.next(books);
            return books;
          }),
          catchError(err => of({ err }))
        );
    } else {
      this.setCurrentBook(bookId);
      if (!this.currentBook) {
        return this.http.get<Book>(`${env.API_URL}/books/${bookId}`)
          .pipe(
            map(book => {
              this.booksSubject.next([...this.books, book]);
              this.currentBookSubject.next(book);
              return book;
            }),
            catchError(err => of({ err }))
          );
      }
    }
  }

  add(book: Book) {
    book.publishedDate = this.dateSrv.toSqlFormat(book.publishedDate as string);
    if (this.currentUser)
      book.userId = this.currentUser.user.userId;

    return this.http.post<Book>(`${env.API_URL}/books/add`, book)
      .pipe(
        map(book => {
          this.booksSubject.next([...this.books, book]);
          return book;
        }),
        catchError(err => of({ err }))
      );
  }

  update(book: Book) {
    book.publishedDate = this.dateSrv.toSqlFormat(book.publishedDate as string);
    if (this.currentUser)
      book.userId = this.currentUser.user.userId;

    return this.http.put<Book>(`${env.API_URL}/books/update`, book)
      .pipe(
        map(updatedBook => {
          this.booksSubject.next(
            this.books.map(book => {
              if (book.bookId === updatedBook.bookId)
                return updatedBook;
              return book;
            })
          );
          return book;
        }),
        catchError(err => of({ err }))
      );
  }

  delete(deleteType: string, book: Book) {
    return this.http.post<Book>(`${env.API_URL}/books/delete?deleteType=${deleteType}`, book)
      .pipe(
        map(deleteResult => {
          this.booksSubject.next(this.books.filter(book => book.bookId !== deleteResult.bookId));
          return book;
        }),
        catchError(err => of({ err }))
      );
  }

}