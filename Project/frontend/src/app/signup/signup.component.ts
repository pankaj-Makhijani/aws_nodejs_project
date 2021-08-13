import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{    

  constructor(private router:Router,private http:HttpClient){}

  active:boolean=false;
  ngOnInit(): void {
    if(localStorage.getItem("jwt")){
      this.active=true;
    }
  }

  message:any;

  async onsubmit(signupform:any){
    console.log(signupform)
    

    await this.http.post("http://localhost:3000/api/signup",signupform)
    .subscribe(res=>{
      this.message=JSON.parse(JSON.stringify(res)).msg || JSON.parse(JSON.stringify(res)).error;
      if(JSON.parse(JSON.stringify(res)).msg){
        window.open("/signin", "_self");
      }
    })
  }

}
