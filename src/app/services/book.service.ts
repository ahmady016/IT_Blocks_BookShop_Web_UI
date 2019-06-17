import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { env } from '../../environments/environment';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {

  public currentBook: Book = null;
  private booksSubject: BehaviorSubject<Book[]>;
  public $books: Observable<Book[]>;

  constructor(private http: HttpClient) {
    this.booksSubject = new BehaviorSubject<Book[]>([]);
    this.$books = this.booksSubject.asObservable();
  }

  public get books(): Book[] {
    return this.booksSubject.value;
  }

  private setCurrentBook(bookId: number) {
    this.currentBook = this.booksSubject.value.find(book => book.bookId === bookId);
  }

  find(bookId?: number) {
    if (!bookId) {
      return this.http.get<Book[]>(`${env.API_URL}/books`)
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
              this.currentBook = book;
              return book;
            }),
            catchError(err => of({ err }))
          );
      }
    }
  }

  add(book: Book) {
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
    return this.http.put<Book>(`${env.API_URL}/books/update`, book)
      .pipe(
        map(updatedBook => {
          this.booksSubject.next(this.books.map(book => {
            if (book.bookId === updatedBook.bookId)
              return updatedBook;
            return book;
          }));
          return book;
        }),
        catchError(err => of({ err }))
      );
  }

  delete(deleteType: string, book: Book) {
    return this.http.post<Book>(`${env.API_URL}/books/delete?deleteType=${deleteType}`, book)
      .pipe(
        map(deleteResult => {
          this.booksSubject.next(this.books.filter(book => book.bookId !== deleteResult.bookId ));
          return book;
        }),
        catchError(err => of({ err }))
      );
  }

}