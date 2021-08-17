import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {

  constructor(private router:Router,private http:HttpClient){}
  imageObj: File;
  emailarray:string[]=[];
  idarray:string[]=[];
  objarray:any[]=[];
  arrlength:any;
  objarray2:any[]=[];
  totalusers:any;
  arrlength2:any;
  imageUrl: string;
  active:boolean=false;
  message:any;
  fname:any;
  lname:any;
  username:any;
  email:any;
  id:any;
  role:any;
  token:any;
  noofusers:any;
  imgselected:boolean=true;
  ngOnInit(): void {
        if(localStorage.getItem("jwt")){
      this.active=true;
      var w:any = localStorage.getItem("jwt")
      w=JSON.parse(w)
      this.fname=w.user.firstname;
      this.lname=w.user.lastname;
      this.username=w.user.firstname +" "+ w.user.lastname;
      this.email=w.user.email;
      this.role=w.user.role;
      this.id=w.user.id;
      this.token=w.token;
      if(this.role!=1){
        window.open("/profile", "_self");
      }
        }
        if(!localStorage.getItem("jwt")){
          window.open("/signin", "_self");
        }
  }
  



  onsubmit(deleteform:any){
    console.log(deleteform)
    if(localStorage.getItem("jwt")){
      var r=confirm("Are You sure you want to delete this account")
      if(r==true){
        var x2:any = localStorage.getItem("jwt")
        x2=JSON.parse(x2)
        var token=x2.token;
        var id=x2.user.id;
        console.log(token)
  
        var reqHeader = new HttpHeaders({ 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
       });
  
        this.http.post(`http://localhost:3000/api/deleteuser/${id}`,deleteform,{ headers: reqHeader })
        .subscribe(res=>{
          var y=JSON.parse(JSON.stringify(res));
          this.message=y.msg;
          console.log(res);
          // console.log(typeof res);
        },(err)=>{
          if(err.status>400) {
          console.log(err.status)
          var res="You are not authorized to perform this action"
          this.message=res;
          }
      })
      }
    }
    if(!localStorage.getItem("jwt")){
      var res="You must be logged in first in order to perform Delete User operation"
      console.log(res)
    this.message=res;
    }
  }
  

  async onsubmit2(signupform:any){
    console.log(signupform)
    

    await this.http.post("http://localhost:3000/api/advancedsignup",signupform)
    .subscribe(res=>{
      this.message=JSON.parse(JSON.stringify(res)).msg || JSON.parse(JSON.stringify(res)).error;
    })
  }

  onclick(){
    if(localStorage.getItem("jwt")){
      var x:any = localStorage.getItem("jwt")
      x=JSON.parse(x)
      var id=x.user.id;
      this.username=x.user.firstname
      var token=x.token;
      console.log(id)
      console.log(token)

      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
     });
     this.objarray=[];
     this.arrlength=0;
      this.http.get(`http://localhost:3000/api/${id}/findallusers`,{ headers: reqHeader })
      .subscribe(res=>{
        var y=JSON.parse(JSON.stringify(res));
        console.log(y)
        this.objarray=[];
        this.arrlength=0;
        // this.noofusers=0;
        if(y.length==0){
          this.noofusers="no";
        }
        else{
          this.noofusers=y.length;
          for(var i = 0; i <= y.length; i++) {
            var obj = y[i];
            this.arrlength=i;
            this.objarray.push(obj)
            // this.emailarray.push(obj.email);
            // this.idarray.push(obj.id)
            // console.log(obj.email);
            // console.log(this.emailarray);
            // console.log(this.idarray);
            // console.log(typeof obj.email);
        }
          // console.log(res);
          // console.log("res is "+res+" type "+typeof res);
          // console.log("y is "+y+" type "+typeof y);
          // for(let i in res){
          //   console.log(res.v)
          // }
          // this.message=obj.email;
          // console.log(typeof res);
        }

      },(err)=>{
        if(err.status>400) {
          console.log(err.status)
          var res="You are not authorized to perform this action"
          this.message=res;
          }
    })
    }
    if(!localStorage.getItem("jwt")){
     var res="You must be logged in first in order to perform Find all users operation"
     console.log(res)
    this.message=res;
    }
  }

  oncardsubmit(cardform:any){
    this.http.post(`http://localhost:3000/api-cards/createcard`, cardform)
    .subscribe(res => {
        this.message = JSON.parse(JSON.stringify(res)).msg;
      }),(err)=>{
        this.message = "Cannot create card";
      }
  }

  oncarddelete(carddeleteform:any){
    console.log(carddeleteform)
    this.http.post(`http://localhost:3000/api-cards/${this.id}/deletecardbyid`, carddeleteform)
    .subscribe(res => {
        this.message = JSON.parse(JSON.stringify(res)).msg;
      })
  }

  ongetalldetails(){
    if(localStorage.getItem("jwt")){
      var x:any = localStorage.getItem("jwt")
      x=JSON.parse(x)
      var id=x.user.id;
      this.username=x.user.firstname
      var token=x.token;
      // console.log(id)
      // console.log(token)

      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
     });
     
     this.objarray2=[];
     this.arrlength2=0;
      // this.http.get(`http://localhost:3000/api/${id}/findallusers`,{ headers: reqHeader })
      this.http.get(`http://localhost:3000/api-cards/getallcards`,{ headers: reqHeader })
      .subscribe(res=>{
        var y=JSON.parse(JSON.stringify(res));
        console.log(y)
        this.objarray2=[];
        this.arrlength2=0;
        if(y.length==0){
        this.arrlength2=0;
          this.totalusers=undefined
          this.message="There aren't any certificates stored in the Database"
        }
        else{
          this.totalusers=0;
          for(var i = 0; i <= y.length; i++) {
            var obj = y[i];
            this.arrlength2=i;
            this.objarray2.push(obj)
            this.totalusers=this.totalusers+obj.users.length;
        }
        }
    }),(err)=>{
        if(err.status>400) {
          console.log(err.status)
          var res="You are not authorized to perform this action"
          this.message=res;
          }
    }
    }
    if(!localStorage.getItem("jwt")){
     var res="You must be logged in first in order to perform Find all users operation"
     console.log(res)
    this.message=res;
    }
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
        localStorage.removeItem("jwt")
        this.http.get("http://localhost:3000/api/signout").subscribe(res=>{
        // console.log(typeof res);
        // console.log(res);
        this.arrlength=0;
        this.message=JSON.parse(JSON.stringify(res)).message;
        window.open("/signin", "_self");
      })
      }
    }
    
  }



  async onsubmit1(updateform:any){
    console.log(updateform)

    var x2:any = localStorage.getItem("jwt")
    x2=JSON.parse(x2)
    var token=x2.token;
    

    var reqHeader = await new HttpHeaders({ 
      'Authorization': `Bearer ${token}`
   });


   
    // await this.http.post(`http://localhost:3000/api/tempupdateuserbyid/${this.id}`,updateform)
    await this.http.post(`http://localhost:3000/api/${this.id}/updateanyuserbyid`,updateform)
    .subscribe(res=>{
      var y=JSON.parse(JSON.stringify(res));
      this.message=y.msg;
      console.log(res);
    },(err)=>{
      var res="You are not authorized to perform this action"
      this.message=err;
  }) 
  }
}
