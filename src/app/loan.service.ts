import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Loan } from '../app/loan.model';
import { map, tap, filter, catchError, mergeMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private loanSource = new BehaviorSubject(null);
  currentLoan = this.loanSource.asObservable();

  sendLoan(loan: Loan) {
    this.loanSource.next(loan)
  }

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://localhost:51500/loans/';
  
  getLoans() {  
    return this.http.get<Loan[]>(this.baseUrl);  
  }  
  deleteLoan(id: number) {  
    return this.http.delete<Loan>(this.baseUrl + id);  
  } 
  createLoan(loan: Loan) {  
    return this.http.post(this.baseUrl, loan);  
  }  
  getLoanById(id: number) {  
    return this.http.get<Loan>(this.baseUrl + id);  
  }  
  updateLoan(loan: Loan) {
    return this.http.put(this.baseUrl + loan.id, loan);  
  }
  getOnlyOpen(){
    return this.http.get<Loan[]>(this.baseUrl).pipe(map(loans => loans.filter(l => l.closed == false)));
  }

}