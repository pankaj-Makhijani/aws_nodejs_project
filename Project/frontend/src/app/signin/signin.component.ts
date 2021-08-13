import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private router:Router,private http:HttpClient){}
  
  active:boolean=false;
  ngOnInit(): void {
    if(localStorage.getItem("jwt")){
      this.active=true;
    }
  }

  message:any;
  w:any;

  onsubmit(signinform:any){
    console.log(signinform)


    this.http.post("http://localhost:3000/api/signin",signinform)
    .subscribe(res=>{
      console.log(res);

      if(!JSON.parse(JSON.stringify(res)).msg){
        if (typeof window !== "undefined") {
          localStorage.setItem("jwt", JSON.stringify(res));
          this.active=true;
          this.message=JSON.parse(JSON.stringify(res)).msg?JSON.parse(JSON.stringify(res)).msg:"User Signed in Successfully";
          this.w=(JSON.parse(JSON.stringify(res))).user.role
          if(this.w==0){
            window.open("/profile", "_self");
          }
          else if(this.w==1){
            window.open("/admin", "_self");
          }
      }
      }
    })
  }

}
