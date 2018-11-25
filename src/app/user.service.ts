import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { User } from '../app/user.model';  
import { map, tap, filter, catchError, mergeMap } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userSource = new BehaviorSubject(null);
  currentUser = this.userSource.asObservable();

  sendUser(user: User) {
    this.userSource.next(user)
  }

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://localhost:51500/users/';  
  
  getUsers() {  
    return this.http.get<User[]>(this.baseUrl);  
  }  
  deleteUser(id: number) {  
    return this.http.delete<User>(this.baseUrl + id);  
  } 
  createUser(user: User) {  
    return this.http.post(this.baseUrl, user);  
  }  
  getUserById(id: number) {  
    return this.http.get<User>(this.baseUrl + id);  
  }  
  updateUser(user: User) {
    return this.http.put(this.baseUrl + user.id, user);  
  }
  //changeStatus(user: User, status: string){
  //  return this.http.put(this.baseUrl + user.id, user, status)
  //}

  getOnlyActive(){
    return this.http.get<User[]>(this.baseUrl).pipe(map(users => users.filter(u => u.status == "Active")));
  }
  searchBySurname(words: string): Observable<User[]>{
    if (!words.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(this.baseUrl).pipe(map(res => res.filter(u => u.surname.toLowerCase().includes(words.toLowerCase()))));
  }
  searchById(words: string): Observable<User[]>{
    if (!words.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(this.baseUrl).pipe(map(res => res.filter(u => u.id.toString().toLowerCase().includes(words.toLowerCase()))));
  }
}