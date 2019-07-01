import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgbDatepickerModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AuthGuard, AnonymousGuard } from '@services/index';

import { SignInComponent } from './users/sign-in/sign.in.component';
import { SignUpComponent } from './users/sign-up/sign.up.component';
import { AuthorListComponent } from './authors/author-list/author.list.component';
import { AuthorFormComponent } from './authors/author-form/author.form.component';
import { BookListComponent } from './books/book-list/book.list.component';
import { BooksSliderComponent } from './books/books-slider/books.slider.component';
import { BookFormComponent } from './books/book-form/book.form.component';
import { BorrowingComponent } from './orders/borrowing/borrowing.component';
import { PurchaseComponent } from './orders/purchase/purchase.component';
import { PageNotFoundComponent } from './page.not.found.component';

const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AnonymousGuard] },
  { path: 'sign-in', component: SignInComponent, canActivate: [AnonymousGuard] },
  { path: 'authors', component: AuthorListComponent, canActivate: [AuthGuard]  },
  { path: 'author-form/:type/:authorId', component: AuthorFormComponent, canActivate: [AuthGuard] },
  { path: 'books', component: BookListComponent, canActivate: [AuthGuard]  },
  { path: 'books-slider', component: BooksSliderComponent, canActivate: [AuthGuard]  },
  { path: 'book-form/:type/:bookId', component: BookFormComponent, canActivate: [AuthGuard] },
  { path: 'purchase/:bookId', component: PurchaseComponent, canActivate: [AuthGuard]  },
  { path: 'borrowing/:bookId', component: BorrowingComponent, canActivate: [AuthGuard]  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    AuthorListComponent,
    AuthorFormComponent,
    BookListComponent,
    BooksSliderComponent,
    BookFormComponent,
    PurchaseComponent,
    BorrowingComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgbCarouselModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SignInComponent,
    SignUpComponent,
    AuthorListComponent,
    AuthorFormComponent,
    BookListComponent,
    BooksSliderComponent,
    BookFormComponent,
    PurchaseComponent,
    BorrowingComponent,
    PageNotFoundComponent
  ]
})
export class AppRoutingModule { }
