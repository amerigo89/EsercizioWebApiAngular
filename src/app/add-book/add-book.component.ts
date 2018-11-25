import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { BookService } from '../book.service';  
import { Router } from "@angular/router";  
import { Book } from '../book.model';
import { ThrowStmt } from '@angular/compiler';


@Component({
  //selector: 'ngbd-dropdown-basic',
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent implements OnInit {

  bookformlabel: string = 'Add Book';  
  bookformbtn: string = 'Save'; 
  constructor(private formBuilder: FormBuilder, private router: Router, 
    private bookService: BookService) {  }

  addForm: FormGroup;  
  btnvisibility: boolean = true;
  availableVisibility: boolean = false;

  status = ['Stored','Lost','Stolen']

  ngOnInit() {
    this.addForm = this.formBuilder.group({  
      id: [],  
      title: ['', Validators.required],  
      author: ['', [Validators.required, Validators.maxLength(20)]],  
      year: ['', [Validators.required, Validators.maxLength(20)]],
      available:['', [Validators.required, Validators.maxLength(5)]],
      status:[]
    });

    this.addForm.controls['available'].setValue("true");

    let bookid = localStorage.getItem('editBookId');
    console.log(bookid);
    if (+bookid > 0) {
      this.bookService.getBookById(+bookid).subscribe(data => {  
      this.addForm.setValue(data);
      })

      this.btnvisibility = false;  
      this.bookformlabel = 'Edit Book with Id: '+ bookid; 
      this.bookformbtn = 'Update';
      this.availableVisibility = true;
    }
  }

  onSubmit() {
    this.addForm.controls['id'].disable();
    this.bookService.createBook(this.addForm.value)  
      .subscribe(data => {  
        this.router.navigate(['list-book']);  
        },  
        error => {  
          alert(error);  
        });  
  }

  onUpdate() {
    //let bookid = localStorage.getItem('editBookId');
    if(this.addForm.controls['status'].value != "Stored"){
      this.addForm.controls['available'].setValue("false");
    }
    this.bookService.updateBook(this.addForm.value).subscribe(data => {  
      this.router.navigate(['list-book']);  
    },
      error => {  
        alert(error);  
      });
    }
}