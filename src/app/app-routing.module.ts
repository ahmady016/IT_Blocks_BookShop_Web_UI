import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

import { SignInComponent } from './users/sign-in/sign.in.component';
import { SignUpComponent } from './users/sign-up/sign.up.component';
import { BookListComponent } from './books/book-list/book.list.component';
import { BorrowingComponent } from './orders/borrowing/borrowing.component';
import { PurchaseComponent } from './orders/purchase/purchase.component';
import { PageNotFoundComponent } from './page.not.found.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'books', component: BookListComponent, canActivate: [AuthGuard]  },
  { path: 'purchase/:bookId', component: PurchaseComponent, canActivate: [AuthGuard]  },
  { path: 'borrowing/:bookId', component: BorrowingComponent, canActivate: [AuthGuard]  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    BookListComponent,
    PurchaseComponent,
    BorrowingComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
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
    PurchaseComponent,
    BorrowingComponent,
    PageNotFoundComponent
  ]
})
export class AppRoutingModule { }
