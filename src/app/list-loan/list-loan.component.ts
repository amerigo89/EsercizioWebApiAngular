import { Component, OnInit } from '@angular/core';
import { LoanService } from '../loan.service';
import { BookService } from '../book.service';
import { UserService } from '../user.service';
import { Loan } from '../loan.model';  
import { Router } from "@angular/router";  
import {map, catchError, concatMap} from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { Book } from '../book.model';
import { User } from '../user.model';
import { Observable, BehaviorSubject, forkJoin, from } from 'rxjs';

@Component({
  selector: 'app-list-loan',
  templateUrl: './list-loan.component.html',
  styleUrls: ['./list-loan.component.css']
})
export class ListLoanComponent implements OnInit {

  loans : Loan[];
  searchForm : FormGroup;

  books:Book[] = [];
  users:User[] = [];
  loan: Loan;
  user: User;

  constructor(private formBuilder: FormBuilder,private loanService: LoanService, private bookService: BookService, private userService: UserService, private router: Router, ) { }

  ngOnInit() {
    localStorage.removeItem('editLoanId');

    this.userService.currentUser.subscribe(user => this.user = user);

    if(this.user != null){
      this.gotLoansByUser(this.user);
      this.userService.userSource.next(null); //per resettare il currentUser nel service senno mi mostra sempre gli stessi loans del currentUser
    }
    else{
      this.getOnlyOpenLoans();    
    }

    //this.loanService.getLoans().subscribe((data: Loan[]) => { this.loans = data; });
    //this.loanService.getOnlyOpen().subscribe((data: Loan[]) => { this.loans = data; });

    this.loanService.currentLoan.subscribe(loan => this.loan = loan);
  } 

  deleteLoan(id: number) {  
    this.loanService.deleteLoan(id)
    .subscribe(data => {
      this.router.navigate(['list-loan']);
      })  
  }

  closeLoan(id:number) {
    let loan = this.loans.find(l => l.id == id);
    if(loan.closed == true){
      alert("Loan already closed");
    }
    else{
      loan.closed = true;
      this.loanService.updateLoan(loan).subscribe(data => {  
        this.router.navigate(['list-loan']);
      },
        error => {  
          alert(error);  
        });
    }  
  }

  // editLoan(id:number): void {
  //   if(this.loans.find(l => l.id == id).closed == false)
  //   {
  //     localStorage.removeItem('editLoanId');
  //     localStorage.setItem('editLoanId', id.toString());
  //     this.router.navigate(['add-loan']);  
  //   }
  //   else{
  //     alert("Closed loans can't be modified");
  //   }
  // }

  editLoanNew(loan: Loan){
    if(loan.closed == false)
    {
      localStorage.removeItem('editLoanId');
      localStorage.setItem('editLoanId', loan.id.toString());
      this.loanService.sendLoan(loan);
      this.router.navigate(['add-loan']);  
    }
    else{
      alert("Closed loans can't be modified");
    }
  }

  addLoan(){
    this.router.navigate(['add-loan']);
  }

  filterClosed(event){
    var isChecked = event.target.checked;
    if(isChecked){
      this.loans = [];
      this.books = [];
      this.users = [];
      this.getAllLoans();
    }
    else{
      this.loans = [];
      this.books = [];
      this.users = [];
      this.getOnlyOpenLoans();
    }
  }

  gotLoansByUser(user : User){
    this.loanService.getLoans().subscribe((data: Loan[]) => { this.loans = data.filter(l => l.userId == user.id);
      from(this.loans).pipe(concatMap(loan => this.bookService.getBookById(loan.bookId)
        .pipe(map(b => this.books.push(b))))).subscribe();
      from(this.loans).pipe(concatMap(loan => this.userService.getUserById(loan.userId)
        .pipe(map(u => this.users.push(u))))).subscribe();
      });  
  }

  getAllLoans(){
    this.loanService.getLoans().subscribe((data: Loan[]) => { this.loans = data;
      from(data).pipe(concatMap(loan => this.bookService.getBookById(loan.bookId)
        .pipe(map(b => this.books.push(b))))).subscribe();
      from(data).pipe(concatMap(loan => this.userService.getUserById(loan.userId)
        .pipe(map(u => this.users.push(u))))).subscribe();
      });       
  }

  getOnlyOpenLoans(){
    this.loanService.getOnlyOpen().subscribe((data: Loan[]) => { this.loans = data;
      from(data).pipe(concatMap(loan => this.bookService.getBookById(loan.bookId)
        .pipe(map(b => this.books.push(b))))).subscribe();
      from(data).pipe(concatMap(loan => this.userService.getUserById(loan.userId)
        .pipe(map(u => this.users.push(u))))).subscribe();
      });       
  }

}