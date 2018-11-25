import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';  
import { ListBookComponent } from './list-book/list-book.component';  
import { AddBookComponent } from './add-book/add-book.component';
import { ListUserComponent } from './list-user/list-user.component';  
import { AddUserComponent } from './add-user/add-user.component';
import { ListLoanComponent } from './list-loan/list-loan.component';  
import { AddLoanComponent } from './add-loan/add-loan.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { SearchComponent } from './search/search.component';

//import { AppComponent } from './app.component';


const routes: Routes = [{ path: '', component: ListBookComponent, pathMatch: 'full' },  
{ path: 'list-book', component: ListBookComponent },  
{ path: 'add-book', component: AddBookComponent },
{ path: 'list-user', component: ListUserComponent },  
{ path: 'add-user', component: AddUserComponent },
{ path: 'list-loan', component: ListLoanComponent },  
{ path: 'add-loan', component: AddLoanComponent },
{ path: 'books/:id', component: BookDetailComponent },
{ path: 'search', component: SearchComponent }
  ];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
