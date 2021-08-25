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
    isuser:boolean=false;
  isadmin:boolean=false;
  ishr:boolean=false;
  message:any;
  w:any;
  role:any;
  ngOnInit(): void {
    if(localStorage.getItem("jwt")){
      this.active=true;
      var w:any = localStorage.getItem("jwt")
      w=JSON.parse(w)
      this.role=w.user.role
      if(this.role==0){
        this.isuser=true;
        this.isadmin=false;
        this.ishr=false;
        window.open("/profile", "_self");
      }
      else if(this.role==1){
        this.isuser=true;
        this.isadmin=true;
        this.ishr=false;            
        window.open("/admin", "_self");
      }
      else if(this.role==2){
        this.isuser=true;
        this.isadmin=false;
        this.ishr=true;
        window.open("/hrpanel", "_self");
      }

    }
    else if(!localStorage.getItem("jwt")){
      this.active=false;
    }
  }

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

  signout(){
    if(typeof window!=="undefined")
    {
      if(!localStorage.getItem("jwt")){
        var res="You must be logged in first in order to perform signout operation"
        console.log(res)
      this.message=res;
      }
      else if(localStorage.getItem("jwt")){
        var x:any = localStorage.getItem("jwt")
        x=JSON.parse(x)
        var id=x.user.id;
        localStorage.removeItem("jwt")
        this.http.get(`http://localhost:3000/api/${id}/signout`).subscribe(res=>{
        // console.log(typeof res);
        // console.log(res);
        this.message=JSON.parse(JSON.stringify(res)).message;
        window.open("/signin", "_self");
      })
      }
    }
    
  }

}
