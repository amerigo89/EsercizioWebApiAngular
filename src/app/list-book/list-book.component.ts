import { Component, OnInit, Input, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { BookService } from '../book.service';  
import { Book } from '../book.model';  
import { Router } from "@angular/router";  
import {map, catchError} from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Observable, Subject } from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {

  book:Book;

  books : Book[];
  searchForm : FormGroup;

  //SEARCH FORM
  books$: Observable<Book[]>;
  private searchTerms = new Subject<string>(); //

  results: Object;
  searchTerm$ = new Subject<string>();

  selectedBook: Book;

  constructor(private formBuilder: FormBuilder,private bookService: BookService, private router: Router, ) { }

  //SEARCH FORM 
  search(title: string): void {
    this.searchTerms.next(title);
  }

  ngOnInit() {
    localStorage.removeItem('editBookId');
    localStorage.removeItem('loanBookId');
    localStorage.removeItem('editLoanId');

    //this.bookService.getBooks().subscribe((data: Book[]) => { this.books = data; });
    this.bookService.getOnlyStored().subscribe((data: Book[]) => { this.books = data; });
   

    this.searchForm = this.formBuilder.group({ 
      bookId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      bookTitle: ['']
      });

//START SEARCH FORM PART
      this.books$ = this.searchTerms.pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(300),
   
        // ignore new term if same as previous term
        distinctUntilChanged(),
   
        // switch to new search observable each time the term changes
        switchMap((title: string) => this.bookService.searchByTitle(title)),
      );
      //END SEARCH FORM PART

      this.bookService.currentBook.subscribe(book => this.book = book); //per mandare il book al loan
  }

  deleteBook(id: number) {  
    this.bookService.deleteBook(id)
    .subscribe(data => {
      this.router.navigate(['list-book']);
      })  
  }

  editBook(id:number): void {
    localStorage.removeItem('editBookId');
    localStorage.setItem('editBookId', id.toString());
    this.router.navigate(['add-book']);  
  }

  searchByTitle(term:string){
    term = this.searchForm.value.bookTitle;
    this.bookService.searchByTitle(term)
      .subscribe(data => {
      this.books = this.books.filter(b => b.title == term);  
      })
  }

  onSelect(book: Book): void {
  this.selectedBook = book;
  }

  addBook(){
    this.router.navigate(['add-book']);
  }

  bookDetail(id: number){
    this.router.navigate(['books/'+id]);
  }

  createLoan(id: number){ //VECCHIO METODO
    localStorage.removeItem('loanBookId');
    localStorage.setItem('loanBookId', id.toString());
    this.router.navigate(['add-loan']);
    //console.log(id);
    //let bookFound = this.books.find(u => u.id == id);
    //return bookFound;
  }

  filterStored(event){
    var isChecked = event.target.checked;
    if(isChecked){
      this.bookService.getBooks().subscribe((data: Book[]) => { this.books = data; });
    }
    else{
       this.bookService.getOnlyStored().subscribe((data: Book[]) => { this.books = data; });
    }
  }

  newLoan(book: Book){
    this.bookService.sendBook(book);
    this.router.navigate(['add-loan']);
  }

}
