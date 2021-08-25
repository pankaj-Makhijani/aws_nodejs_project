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



  onsubmit(signinform:any){
    console.log(signinform)


    this.http.post("http://localhost:3000/api/signin",signinform)
    .subscribe(res=>{
      console.log(res);
      var x=JSON.parse(JSON.stringify(res))
      if(!x.err){
        if (typeof window !== "undefined") {
          localStorage.setItem("jwt", JSON.stringify(res));
          this.active=true;
          // this.message=x.msg?x.msg:"User Signed in Successfully";
          this.w=(x).user.role
          if(this.w==0){
            this.isuser=true;
            this.isadmin=false;
            this.ishr=false;
            window.open("/profile", "_self");
          }
          else if(this.w==1){
            this.isuser=true;
            this.isadmin=true;
            this.ishr=false;            
            window.open("/admin", "_self");
          }
          else if(this.w==2){
            this.isuser=true;
            this.isadmin=false;
            this.ishr=true;
            window.open("/hrpanel", "_self");
          }
      }
      }
      else if(x.err){
        this.message=x.err;
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
