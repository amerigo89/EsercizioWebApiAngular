import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { LoanService } from '../loan.service';
import { BookService } from '../book.service';
import { UserService } from '../user.service';  
import { Router } from "@angular/router";  
import {ListBookComponent} from '../list-book/list-book.component'

import { FormControl } from "@angular/forms";
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import { BookDetailComponent } from '../book-detail/book-detail.component';
import { Book } from '../book.model';
import { Loan } from '../loan.model';

@Component({
  selector: 'app-add-loan',
  templateUrl: './add-loan.component.html',
  styleUrls: ['./add-loan.component.css'],
  providers:[ListBookComponent, BookDetailComponent],

})
export class AddLoanComponent implements OnInit {

  loanformlabel: string = 'Add Loan';  
  loanformbtn: string = 'Save';

  constructor(private formBuilder: FormBuilder, private router: Router, 
    private loanService: LoanService, private listBookComp: ListBookComponent, private bookDetails: BookDetailComponent, private bookService: BookService, private userService: UserService ) {  }

  addForm: FormGroup;  
  btnvisibility: boolean = true;
  closedVisibility: boolean = false;
  userInfoVisibility: boolean = true;

  results: any[] = [];
  queryField: FormControl = new FormControl();

  book: Book;
  
  receivedBook: Book;
  receivedLoan: Loan;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      id: [],  
      bookId: [],
      bookTitle: [],
      userInfos: [],
      userId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate:['', [Validators.required]],
      closed:[],
    });
  
    let loanid = localStorage.getItem('editLoanId');
    let bookid = localStorage.getItem('loanBookId');

    this.addForm.controls['closed'].setValue("false");

    this.queryField.valueChanges.pipe(debounceTime(200)).pipe(distinctUntilChanged()).subscribe( queryField => this.userService.searchBySurname(queryField).
    subscribe(response => this.results = response));

    if (+loanid > 0) {
      console.log(loanid);
      //this.loanService.getLoanById(+loanid).subscribe(data => {  
      //this.addForm.setValue(data);
      //})

      this.loanService.currentLoan.subscribe(loan => console.log(loan));


      this.loanService.currentLoan.subscribe(loan => this.addForm.patchValue(loan));

      this.btnvisibility = false;
      this.closedVisibility = true;
      this.userInfoVisibility = false;
      this.loanformlabel = 'Edit Loan with Id: '+ loanid;  
      this.loanformbtn = 'Update';  
    }

    if (+bookid > 0) {
      this.addForm.controls['bookTitle'].disable();
      this.addForm.controls['id'].disable();
      //this.addForm.controls.bookId.setValue(+bookid);

      //this.bookService.getBookById(+bookid).subscribe(result => 
        //{this.addForm.controls.bookTitle.setValue(result.title)});
    }

    if(+loanid == 0){
      this.bookService.currentBook.subscribe(book => this.addForm.controls.bookTitle.setValue(book.title));
      this.bookService.currentBook.subscribe(book => this.addForm.controls.bookId.setValue(book.id));
    }

  }

  onSubmit() {
    this.addForm.controls['id'].disable();
    this.addForm.controls['userInfos'].disable();
    this.addForm.controls['bookTitle'].disable();

    this.loanService.createLoan(this.addForm.value)  
      .subscribe(data => {  
        this.router.navigate(['list-loan']);  
        },  
        error => {  
          alert(error);  
        });   
  }

  onUpdate() {
    this.loanService.updateLoan(this.addForm.value).subscribe(data => {  
      this.router.navigate(['list-loan']);  
    },
      error => {  
        alert(error);  
      });
    }

  setUser(id: string, surname: string, name: string ){
    this.addForm.controls['userId'].setValue(id);
    this.addForm.controls['userInfos'].setValue(surname + " " + name);
    this.results = []; //per nascondere risultati dopo click scelta
  }
}
