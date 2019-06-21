import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { SignInComponent } from './users/sign-in/sign.in.component';
import { SignUpComponent } from './users/sign-up/sign.up.component';
import { BookListComponent } from './books/book-list/book.list.component';
import { BorrowingComponent } from './orders/borrowing/borrowing.component';
import { PurchaseComponent } from './orders/purchase/purchase.component';
import { PageNotFoundComponent } from './page.not.found.component';
import { BookFormComponent } from './books/book-form/book.form.component';

import { AuthGuard } from './_services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'books', component: BookListComponent, canActivate: [AuthGuard]  },
  { path: 'book-form/:type/:bookId', component: BookFormComponent, canActivate: [AuthGuard] },
  { path: 'purchase/:bookId', component: PurchaseComponent, canActivate: [AuthGuard]  },
  { path: 'borrowing/:bookId', component: BorrowingComponent, canActivate: [AuthGuard]  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    BookListComponent,
    BookFormComponent,
    PurchaseComponent,
    BorrowingComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SignInComponent,
    SignUpComponent,
    BookListComponent,
    BookFormComponent,
    PurchaseComponent,
    BorrowingComponent,
    PageNotFoundComponent
  ]
})
export class AppRoutingModule { }
