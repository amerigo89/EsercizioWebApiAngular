import { Component } from '@angular/core';
import { Router } from "@angular/router";  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WebApiLibrary';

  constructor(private router: Router, ) { }

  goToBooks(){
    this.router.navigate(['list-book']);
  }

  goToUsers(){
    this.router.navigate(['list-user']);
  }

  goToLoans(){
    this.router.navigate(['list-loan']);
  }
}
