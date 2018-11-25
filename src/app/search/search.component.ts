import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';  
import { Book } from '../book.model';  
import { Router } from "@angular/router";  
import {map, catchError} from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Observable, Subject } from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import { FormControl } from "@angular/forms";
import { UserService } from '../user.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  results: any[] = [];
  
  queryField: FormControl = new FormControl();
  searchForm: FormGroup;

  filterByTitle: boolean = true;
  searchBooks: boolean = true;

  bookVisibility: boolean = true;
  userVisibility: boolean = true;

  placeHolder: string;
  radioCaption1: string;
  radioCaption2: string;

  constructor(private bookService: BookService, private userService: UserService , private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {

    //this.activeRoute.params.subscribe(url => { 
      //console.log(params) //log the entire params object
      //console.log(params['id']) //log the value of id
    //});

    this.setSearchForm(this.router.url);



    this.queryField.valueChanges.subscribe( result => console.log(result));

    if(this.searchBooks){
      this.searchByTitle();
    }
    if(!this.searchBooks){
      this.searchBySurname();
    }

    //METODO ALTERNATIVO
    this.searchForm = this.formBuilder.group({
      //terms: [''],
      bookFilters: new FormControl()
      });

      //this.searchForm.controls['terms'].valueChanges.pipe(debounceTime(200)).pipe(distinctUntilChanged()).subscribe( result => console.log(result));

      //this.searchForm.controls['terms'].valueChanges.pipe(debounceTime(200)).pipe(distinctUntilChanged()).subscribe(terms => 
        //this.bookService.searchByTitle(terms).subscribe(data => this.results = data));

  }

  radioChange(e){
    var target = e.target;
      if (target.value == "Title"){
        //this.searchBooks = true;
        this.filterByTitle = true;
        this.searchByTitle();
      }
      else if (target.value == "Author"){
        this.filterByTitle = false;
        this.searchByAuthor();
      }
      else if (target.value == "Surname"){
        this.searchBySurname();
      }
      else if (target.value == "Id"){
        this.searchByUserId();
      }
  }

  setSearchForm(url: string){
    console.log(url);
    if(url.includes("book")){
      this.searchBooks = true;
      this.userVisibility = false;
      this.placeHolder = "Search for Books...";
      this.radioCaption1 = "Title"
      this.radioCaption2 = "Author";
    }
    else if(url.includes("user")){
      this.searchBooks = false;
      this.placeHolder = "Search for Users...";
      this.radioCaption1 = "Surname"
      this.radioCaption2 = "Id";
    }
  }

  searchByTitle(){
    this.queryField.valueChanges.pipe(debounceTime(200)).pipe(distinctUntilChanged()).
      subscribe( queryField => this.bookService.searchByTitle(queryField).
      subscribe(response => this.results = response));
  }

  searchByAuthor(){
    this.queryField.valueChanges.pipe(debounceTime(200)).pipe(distinctUntilChanged()).
      subscribe( queryField => this.bookService.searchByAuthor(queryField).
      subscribe(response => this.results = response));
  }

  searchBySurname(){
    this.queryField.valueChanges.pipe(debounceTime(200)).pipe(distinctUntilChanged()).
      subscribe( queryField => this.userService.searchBySurname(queryField).
      subscribe(response => this.results = response));
  }

  searchByUserId(){
    this.queryField.valueChanges.pipe(debounceTime(200)).pipe(distinctUntilChanged()).
        subscribe( queryField => this.userService.searchById(queryField).
        subscribe(response => this.results = response));
  }

}
