import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';  
import { FormsModule, ReactiveFormsModule } from "@angular/forms";  

import { ListBookComponent } from './list-book/list-book.component';  
import { AddBookComponent } from './add-book/add-book.component';  
import { BookService } from './book.service';
import { ListUserComponent } from './list-user/list-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ListLoanComponent } from './list-loan/list-loan.component';
import { AddLoanComponent } from './add-loan/add-loan.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    ListBookComponent,  
    AddBookComponent, 
    ListUserComponent, 
    AddUserComponent, 
    ListLoanComponent, 
    AddLoanComponent,
    BookDetailComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,  
    HttpClientModule,  
    AppRoutingModule,  
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }