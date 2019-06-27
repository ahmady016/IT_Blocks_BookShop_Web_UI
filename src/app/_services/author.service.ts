import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { env } from '../../environments/environment';
import { DateService } from './date.service';
import { AuthUser, Author } from 'src/app/_models';
import LS from '../localStorage';

@Injectable({ providedIn: 'root' })
export class AuthorService {

  private currentUser: AuthUser = null;
  private authorsSubject: BehaviorSubject<Author[]>;
  private currentAuthorSubject: BehaviorSubject<Author>;
  public $books: Observable<Author[]>;

  constructor(
    private http: HttpClient,
    private dateSrv: DateService,
    private toastr: ToastrService
  ) {
    this.authorsSubject = new BehaviorSubject<Author[]>([]);
    this.currentAuthorSubject = new BehaviorSubject<Author>(null);
    this.$books = this.authorsSubject.asObservable();
    this.currentUser = LS.get('currentUser');
  }

  public get authors(): Author[] {
    return this.authorsSubject.value;
  }

  public get currentAuthor(): Author {
    return this.currentAuthorSubject.value;
  }

  private setCurrentAuthor(authorId: number) {
    this.currentAuthorSubject.next(this.authorsSubject.value.find(author => author.authorId === authorId));
  }

  query(value: string) {
    return this.http.get<Author[]>(`${env.API_URL}/authors/query?filters=authorName|%|${value}`)
      .pipe(
        map(authors => {
          authors.forEach(author => author.birthDate = (new Date(author.birthDate)).toLocaleDateString('en-gb'))
          this.authorsSubject.next(authors);
          return authors;
        })
      );
  }

  find(authorId?: number): any {
    if (!authorId) {
      return this.http.get<Author[]>(`${env.API_URL}/authors/list/existing`)
        .pipe(
          map(authors => {
            authors.forEach(author => author.birthDate = (new Date(author.birthDate)).toLocaleDateString('en-gb'))
            this.authorsSubject.next(authors);
            return authors;
          })
        );
    } else {
      this.setCurrentAuthor(authorId);
      if (!this.currentAuthor) {
        return this.http.get<Author>(`${env.API_URL}/authors/${authorId}`)
          .pipe(
            map(author => {
              author.birthDate = (new Date(author.birthDate)).toLocaleDateString('en-gb')
              this.authorsSubject.next([...this.authors, author]);
              this.currentAuthorSubject.next(author);
              return author;
            })
          );
      }
    }
  }

  add(author: Author) {
    author.birthDate = this.dateSrv.toSqlFormat(author.birthDate as string);
    if (this.currentUser)
      author.userId = this.currentUser.user.userId;

    return this.http.post<Author>(`${env.API_URL}/authors/add`, author)
      .pipe(
        map(author => {
          author.birthDate = (new Date(author.birthDate)).toLocaleDateString('en-gb')
          this.authorsSubject.next([...this.authors, author]);
          this.toastr.success('The Author is added successfully ...', 'Success', {
            progressBar: true
          });
          return author;
        })
      );
  }

  update(author: Author) {
    author.birthDate = this.dateSrv.toSqlFormat(author.birthDate as string);
    if (this.currentUser)
      author.userId = this.currentUser.user.userId;

    return this.http.put<Author>(`${env.API_URL}/authors/update`, author)
      .pipe(
        map(updatedAuthor => {
          updatedAuthor.birthDate = (new Date(updatedAuthor.birthDate)).toLocaleDateString('en-gb')
          this.authorsSubject.next(
            this.authors.map(author => {
              if (author.authorId === updatedAuthor.authorId)
                return updatedAuthor;
              return author;
            })
          );
          this.toastr.success('The Author is updated successfully ...', 'Success', {
            progressBar: true
          });
          return author;
        })
      );
  }

  delete(deleteType: string, author: Author) {
    return this.http.post<Author>(`${env.API_URL}/authors/delete?deleteType=${deleteType}`, author)
      .pipe(
        map(deleteResult => {
          this.authorsSubject.next(this.authors.filter(book => book.authorId !== deleteResult.authorId));
          this.toastr.success('The Author is deleted successfully ...', 'Success', {
            progressBar: true
          });
          return author;
        })
      );
  }

}
