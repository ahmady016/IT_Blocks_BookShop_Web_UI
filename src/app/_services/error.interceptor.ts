import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from 'src/app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authSrv: AuthService,
    private toastr: ToastrService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError(err => {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          if ([401, 403].includes(err.status)) {
            this.authSrv.logout();
            location.reload(true);
            this.toastr.error('Unauthorized access', 'Auth', {
              progressBar: true
            });
          }
          let error = {
            message: !err.error || !err.error.message ? err.message : err.error.message,
            innerMessage: err.error && err.error.innerException ? err.error.innerException.Message : '',
            statusText: err.statusText,
            statusCode: err.status
          };
          this.toastr.error(error.innerMessage || error.message, 'Error', {
            progressBar: true
          });
          return throwError(error);
        })
      )
  }

}
