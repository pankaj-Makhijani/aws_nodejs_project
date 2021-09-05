import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hrpanel',
  templateUrl: './hrpanel.component.html',
  styleUrls: ['./hrpanel.component.css']
})
export class HrpanelComponent implements OnInit {

  constructor(private router:Router,private http:HttpClient){}
  imageObj: File;
  mngcreateuser:boolean=false;
  mngupdateuser:boolean=false;
  mngdeleteuser:boolean=false;
  mnggetuser:boolean=true;
  mngcreatecert:boolean=false;
  mngdeletecert:boolean=false;
  mnggetcert:boolean=false;

  isuser:boolean=false;
  isadmin:boolean=false;
  ishr:boolean=false;

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
  cardcreatemsg:any;
  cardrmvmsg:any;
  fname:any;
  lname:any;
  username:any;
  email:any;
  id:any;
  role:any;
  token:any;
  noofusers:any;
  roles:any;
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
      this.roles=w.user.rolename
      if(this.roles.includes('admin')){
        this.isadmin=true;
      }

      if(this.roles.includes('hr')){
        this.ishr=true;
      }
      
      if(this.roles.includes('user')){
        this.isuser=true;
      }

      // console.log(this.ishr)
      // console.log(this.isadmin)
      // console.log(this.isuser)
      if(!this.roles.includes('hr')){
        // alert("some bug")
        if(this.roles.includes('admin')){
          window.open("/admin", "_self");
        }

        else if(this.roles.includes('user'))
          window.open("/profile", "_self");

        else{
          window.open("/account", "_self");
        }

      }

    //fetch all users from backend
      var x:any = localStorage.getItem("jwt")
      x=JSON.parse(x)
      var id=x.user.id;
      this.username=x.user.firstname
      var token=x.token;
      //console.log(id)
      ////console.log(token)

      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
     });
     
     this.objarray=[];
     this.arrlength=0;
     this.message=""
      this.http.get(`http://localhost:3000/api/${id}/findallusersbyhr`,{ headers: reqHeader })
      .subscribe(res=>{
        var y=JSON.parse(JSON.stringify(res));
        ////console.log(y)
        this.message=y.msg;
        this.objarray=[];
        this.arrlength=0;
        // this.noofusers=0;
        if(y.length==0){
          this.noofusers="no";
        }
        else{
          this.noofusers=y.length;
          for(var i = 0; i < y.length; i++) {
            var obj = y[i];
            this.arrlength=i;
            this.objarray.push(obj)
        }
        }

      },(err)=>{
        if(err.status>400) {
          ////console.log(err.status)
          var res="You are not authorized to perform this action"
          this.message=res;
          }
    })
    //fetch all users from backend


    //fetch all certificates from backend
    var x:any = localStorage.getItem("jwt")
    x=JSON.parse(x)
    var id=x.user.id;
    this.username=x.user.firstname
    var token=x.token;
    // //console.log(id)
    // //console.log(token)

    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
   });
   
   this.objarray2=[];
   this.arrlength2=0;
    // this.http.get(`http://localhost:3000/api/${id}/findallusers`,{ headers: reqHeader })
    this.http.get(`http://localhost:3000/api-cards/${this.id}/getallcardsbyhr`,{ headers: reqHeader })
    .subscribe(res=>{
      var y=JSON.parse(JSON.stringify(res));
      //console.log(y)
      this.objarray2=[];
      this.arrlength2=0;
      if(y.length==0){
      this.arrlength2=0;
        this.totalusers=undefined
        this.message="There aren't any certificates stored in the Database"
      }
      else{
        this.totalusers=0;
        for(var i = 0; i < y.length; i++) {
          var obj = y[i];
          this.arrlength2=i;
          this.objarray2.push(obj)
          this.totalusers=this.totalusers+obj.users.length;
      }
      }
  }),(err)=>{
      if(err.status>400) {
        //console.log(err.status)
        var res="You are not authorized to perform this action"
        this.message=res;
        }
  }
    
    //fetch all certificates from backend


        }
        if(!localStorage.getItem("jwt")){
          this.active=false
          window.open("/signin", "_self");
        }

        
  }
  

  managegetuser(){
  this.mnggetuser=true;
  this.mnggetcert=false;
  this.ngOnInit();
  }


  managegetcert(){
  this.mnggetuser=false;
  this.mnggetcert=true;
  this.ngOnInit();
  }

  signout(){
    if(typeof window!=="undefined")
    {
      if(!localStorage.getItem("jwt")){
        var res="You must be logged in first in order to perform signout operation"
        //console.log(res)
      this.message=res;
      }
      else if(localStorage.getItem("jwt")){
        var x:any = localStorage.getItem("jwt")
        x=JSON.parse(x)
        var id=x.user.id;
        localStorage.removeItem("jwt")
        this.http.get(`http://localhost:3000/api/${id}/signout`).subscribe(res=>{
        // //console.log(typeof res);
        // //console.log(res);
        this.arrlength=0;
        this.message=JSON.parse(JSON.stringify(res)).message;
        window.open("/signin", "_self");
      })
      }
    }
    
  }

}
