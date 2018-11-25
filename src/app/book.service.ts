import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Book } from '../app/book.model';  
import { map, tap, filter, catchError, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  private bookSource = new BehaviorSubject(null);
  currentBook = this.bookSource.asObservable();

  sendBook(book: Book) {
    this.bookSource.next(book)
  }

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://localhost:51500/books/';  
  
  getBooks() {  
    return this.http.get<Book[]>(this.baseUrl);  
  }  
  deleteBook(id: number) {  
    return this.http.delete<Book>(this.baseUrl + id);  
  } 
  createBook(book: Book) {  
    return this.http.post(this.baseUrl, book);  
  }  
  getBookById(id: number) {  
    return this.http.get<Book>(this.baseUrl + id);  
  }  
  updateBook(book: Book) {
    return this.http.put(this.baseUrl + book.id, book);  
  }
  getOnlyStored(){
    return this.http.get<Book[]>(this.baseUrl).pipe(map(books => books.filter(b => b.status == "Stored")));
  }
  searchByTitle(words: string): Observable<Book[]>{
    if (!words.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
   //FUNZIONA!!
    return this.http.get<Book[]>(this.baseUrl).pipe(map(res => res.filter(b => b.title.toLowerCase().includes(words.toLowerCase()))));
  }
  searchByAuthor(words: string): Observable<Book[]>{
    if (!words.trim()) {
      return of([]);
    }
    return this.http.get<Book[]>(this.baseUrl).pipe(map(res => res.filter(b => b.author.toLowerCase().includes(words.toLowerCase()))));
  }
}