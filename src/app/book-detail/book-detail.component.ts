import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { BookService } from '../book.service';  
import { Router } from "@angular/router";  
import { Book } from '../book.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})

export class BookDetailComponent implements OnInit {

  book: Book;

  constructor(private bookService: BookService, private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    //this.activeRoute.params.subscribe(params => {
      //console.log(params) //log the entire params object
      //console.log(params['id']) //log the value of id
    //});

      this.activeRoute.params.subscribe(params => {
      this.bookService.getBookById(params['id']).subscribe(result => {this.book = result});
      //console.log(this.book.title);
      });
  }

  deleteBook(id: number) {  
    this.bookService.deleteBook(id)
    .subscribe(data => {
      this.router.navigate(['list-book']);
      })
  }

  createLoan(id: number){
    localStorage.removeItem('loanBookId');
    localStorage.setItem('loanBookId', id.toString());
    this.router.navigate(['add-loan']);
  }

}
