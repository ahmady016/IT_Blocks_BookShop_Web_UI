import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { env } from '../../environments/environment';
import { User, AuthUser } from 'src/app/_models';
import { DateService } from './date.service';
import LS from '../localStorage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public $currentUser: Observable<User>;

  constructor(
      private http: HttpClient,
      private dateSrv: DateService
    ) {
    this.currentUserSubject = new BehaviorSubject<User>(LS.get('currentUser').user);
    this.$currentUser = this.currentUserSubject.asObservable();
  }

  private doLogin(authUser: AuthUser) {
    // login successful if there's a jwt token in the response
    if (authUser && authUser.accessToken) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      LS.set('currentUser', authUser);
      this.currentUserSubject.next(authUser.user);
    }
  }

  public get currentUser(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<AuthUser>(`${env.API_URL}/users/sign-in`, { email, password })
      .pipe(
        map(authUser => {
          this.doLogin(authUser);
          return authUser;
        }),
        catchError(err => of({ err }))
      );
  }

  register(user: User) {
    user.birthDate = this.dateSrv.toSqlFormat(user.birthDate as string);
    return this.http.post<AuthUser>(`${env.API_URL}/users/sign-up`, user)
      .pipe(
        map(authUser => {
          this.doLogin(authUser);
          return authUser;
        }),
        catchError(err => of({ err }))
      );
  }

  logout() {
    // remove user from local storage to log user out
    LS.remove('currentUser');
    this.currentUserSubject.next(null);
  }
}