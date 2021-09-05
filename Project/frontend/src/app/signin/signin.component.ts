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
  message:any;
  w:any;
  role:any;
  roles:any;
  ngOnInit(): void {
    if(localStorage.getItem("jwt")){
      this.active=true;
      var w:any = localStorage.getItem("jwt")
      w=JSON.parse(w)
      this.role=w.user.role
      this.roles=w.user.rolename;
      if(this.roles.includes('admin')){
        window.open("/admin", "_self");
      }

      else if(this.roles.includes('hr')){
        window.open("/hrpanel", "_self");
      }
      
      else if(this.roles.includes('user')){
        window.open("/profile", "_self");
      }
      else{
        window.open("/account", "_self");
      }
    }
    else if(!localStorage.getItem("jwt")){
      this.active=false;
    }
  }



  onsubmit(signinform:any){
    //console.log(signinform)


    this.http.post("http://localhost:3000/api/signin",signinform)
    .subscribe(res=>{
      //console.log(res);
      var x=JSON.parse(JSON.stringify(res))
      if(!x.err){
          localStorage.setItem("jwt", JSON.stringify(res));
          this.active=true;
          // this.message=x.msg?x.msg:"User Signed in Successfully";
          this.w=(x).user.role
          this.roles=(x).user.rolename;
          if(this.roles.includes('admin')){
            window.open("/admin", "_self");
          }
    
          else if(this.roles.includes('hr')){
            window.open("/hrpanel", "_self");
          }
          
          else if(this.roles.includes('user')){
            window.open("/profile", "_self");
          }
          else{
            window.open("/account", "_self");
          }
      }
      else if(x.err){
        this.message=x.err;
      }
    })
  }

}
