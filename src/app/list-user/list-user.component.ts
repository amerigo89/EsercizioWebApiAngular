import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';  
import { User } from '../user.model';  
import { Router } from "@angular/router";  
import {map, catchError} from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  users : User[];
  searchForm : FormGroup;
  user: User;

  constructor(private formBuilder: FormBuilder,private userService: UserService, private router: Router, ) { }

  ngOnInit() {

    localStorage.removeItem('userId');

    //this.userService.getUsers().subscribe((data: User[]) => { this.users = data; });

    this.userService.getOnlyActive().subscribe((data: User[]) => { this.users = data; });

    this.userService.currentUser.subscribe(user => this.user = user);
  }

  setUserCancelled(id:number): void {
    let user = this.users.find(u => u.id == id);
    if(user.status == "Cancelled"){
      alert("User already cancelled");
    }
    else{
      user.status = "Cancelled";
      this.userService.updateUser(user).subscribe(data => {  
        this.router.navigate(['list-user']);
      },
        error => {  
          alert(error);  
        });
    }
  }

  deleteUser(id: number) {  
    this.userService.deleteUser(id)
    .subscribe(data => {
      this.router.navigate(['list-user']);
      })  
  }

  editUser(id:number): void {
    localStorage.removeItem('userId');
    localStorage.setItem('userId', id.toString());
    this.router.navigate(['add-user']);  
  }

  searchById() {
    console.log(this.searchForm.value.userId);
    var id = parseInt(this.searchForm.value.userId);
    this.userService.getUserById(id)
      .subscribe(data => {
        this.users = this.users.filter(u => u.id == id);  
      })
  }

  addUser(){
    this.router.navigate(['add-user']);
  }

  filterActive(event){
    var isChecked = event.target.checked;
    if(isChecked){
      this.userService.getUsers().subscribe((data: User[]) => { this.users = data; });
    }
    else{
       this.userService.getOnlyActive().subscribe((data: User[]) => { this.users = data; });
    }
  }

  getLoans(user: User){
    this.userService.sendUser(user);
    this.router.navigate(['list-loan']);
  }

}
