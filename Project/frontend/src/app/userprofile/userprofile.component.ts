import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageUploadService } from '../image-upload.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  constructor(private router:Router,private http:HttpClient,private imageUploadService: ImageUploadService){}
  imageObj: File;
  active:boolean=false;
  accaction:boolean=true;
  certaction:boolean=false;
  imageUrl: string;
  isuser:boolean=false;
  isadmin:boolean=false;
  ishr:boolean=false;
  message:any;
  fname:any;
  lname:any;
  username:any;
  email:any;
  id:any;
  role:any;
  token:any;
  imgselected:boolean=false;
  objarray2:any[]=[];
  objid2:any[]=[];
  objname2:any[]=[];
  roles:any;
  // totalusers:any;
  arrlength2:any;
  ngOnInit(): void {
        if(localStorage.getItem("jwt")){
          this.active=true
      var w:any = localStorage.getItem("jwt")
      w=JSON.parse(w)
      this.fname=w.user.firstname;
      this.lname=w.user.lastname;
      this.username=w.user.firstname +" "+ w.user.lastname;
      this.email=w.user.email;
      this.role=w.user.role;
      this.roles=w.user.rolename;
      this.id=w.user.id;
      this.token=w.token;

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

      if(!this.roles.includes('user')){
        if(this.roles.includes('admin'))
          window.open("/admin", "_self");

        else if(this.roles.includes('hr'))
          window.open("/hr", "_self");

        else
        window.open("/account", "_self");
      }

        }
        if(!localStorage.getItem("jwt")){
          this.active=false;
          window.open("/signin", "_self");
        }

        this.http.get(`http://localhost:3000/api/getcardbyid/${this.id}`)
        .subscribe(res=>{
        var y=JSON.parse(JSON.stringify(res));
        // console.log(y.cards)
        for(var i = 0; i < y.cards.length; i++) {
          var obj = y.cards[i];
          this.arrlength2=i+1;
          this.objarray2.push(obj)
          this.objid2.push(obj.id)
          this.objname2.push(obj.cardname)
        }
        // console.log(this.arrlength2)
        // console.log(this.objname2)
      })
  }

  signout(){

    
    if(typeof window!=="undefined")
    {
      if(!localStorage.getItem("jwt")){
        
        var res="You must be logged in first in order to perform signout operation"
        //console.log(res)
      this.message=res;
      }
      else{
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