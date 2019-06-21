import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { env } from '../../environments/environment';
import { DateService } from './date.service';
import { AuthUser, Book } from 'src/app/_models';
import LS from '../localStorage';

@Injectable({ providedIn: 'root' })
export class BookService {

  private currentUser: AuthUser = null;
  private booksSubject: BehaviorSubject<Book[]>;
  private currentBookSubject: BehaviorSubject<Book>;
  public $books: Observable<Book[]>;

  constructor(
    private http: HttpClient,
    private dateSrv: DateService,
    private toastr: ToastrService
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
        })
      );
  }

  find(bookId?: number): any {
    if (!bookId) {
      return this.http.get<Book[]>(`${env.API_URL}/books/list/existing`)
        .pipe(
          map(books => {
            this.booksSubject.next(books);
            return books;
          })
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
            })
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
          this.toastr.success('The book is added successfully ...', 'Success', {
            progressBar: true
          });
          return book;
        })
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
          this.toastr.success('The book is updated successfully ...', 'Success', {
            progressBar: true
          });
          return book;
        })
      );
  }

  delete(deleteType: string, book: Book) {
    return this.http.post<Book>(`${env.API_URL}/books/delete?deleteType=${deleteType}`, book)
      .pipe(
        map(deleteResult => {
          this.booksSubject.next(this.books.filter(book => book.bookId !== deleteResult.bookId));
          this.toastr.success('The book is deleted successfully ...', 'Success', {
            progressBar: true
          });
          return book;
        })
      );
  }

}
