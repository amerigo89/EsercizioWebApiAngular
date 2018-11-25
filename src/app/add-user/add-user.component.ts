import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { UserService } from '../user.service';  
import { Router } from "@angular/router";  

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userformlabel: string = 'Add User';  
  userformbtn: string = 'Save';  
  constructor(private formBuilder: FormBuilder, private router: Router, 
    private userService: UserService) {  }

  addForm: FormGroup;  
  btnvisibility: boolean = true;
  statusVisibility: boolean = false;


  status = ['Active','Cancelled']

  ngOnInit() {
    this.addForm = this.formBuilder.group({  
      id: [],  
      name: ['', Validators.required],  
      surname: ['', [Validators.required]],  
      dateOfBirth: ['', [Validators.required]],
      phone:['', [Validators.required, Validators.maxLength(15)]],
      email:['', [Validators.required]],
      city:['', [Validators.required]],
      address:['', [Validators.required]],
      status:[] 
    });
  
    let userid = localStorage.getItem('userId');
    console.log(userid);
    if (+userid > 0) {
      this.userService.getUserById(+userid).subscribe(data => {  
      this.addForm.setValue(data);
      })

      this.btnvisibility = false;  
      this.userformlabel = 'Edit User with Id: '+ userid;  
      this.userformbtn = 'Update';
      this.statusVisibility = true;
    }
  }

  onSubmit() {
    this.addForm.controls['id'].disable();
    this.addForm.controls['status'].setValue("Active");
    this.userService.createUser(this.addForm.value)  
      .subscribe(data => {  
        this.router.navigate(['list-user']);  
        },  
        error => {  
          alert(error);  
        });  
  }

  onUpdate() {
    //let bookid = localStorage.getItem('editBookId');
    this.userService.updateUser(this.addForm.value).subscribe(data => {  
      this.router.navigate(['list-user']);  
    },
      error => {  
        alert(error);  
      });
    }
}
