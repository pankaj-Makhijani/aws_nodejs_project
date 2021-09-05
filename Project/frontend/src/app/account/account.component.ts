
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageUploadService } from '../image-upload.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {


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
  // totalusers:any;
  arrlength2:any;
  roles:any;
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
      this.id=w.user.id;
      this.roles=w.user.rolename;
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

      // //console.log(this.ishr)
      // //console.log(this.isadmin)
      // //console.log(this.isuser)


      if(!this.roles.includes('user') && this.roles.includes('admin')){
        window.open("/admin", "_self");
      }

      if(!this.roles.includes('user') && this.roles.includes('hr')){
        window.open("/hr", "_self");
      }

    


        }
        if(!localStorage.getItem("jwt")){
          this.active=false
          window.open("/signin", "_self");
        }

  }
  

  async onsubmit(updateform:any){
    //console.log(updateform)

    var x2:any = localStorage.getItem("jwt")
    x2=JSON.parse(x2)
    var token=x2.token;
    

    var reqHeader = await new HttpHeaders({ 
      'Authorization': `Bearer ${token}`
   });


   
    await this.http.post(`http://localhost:3000/api/tempupdateuserbyid/${this.id}`,updateform)
    // await this.http.post(`http://localhost:3000/api/updateuserbyid/${this.id}`,{ headers: reqHeader },updateform)
    .subscribe(res=>{
      var y=JSON.parse(JSON.stringify(res));
      this.message=y.msg;
      //console.log(res);
      this.fname=updateform.fname;
      this.lname=updateform.lname;
      this.username=updateform.fname +" "+ updateform.lname;
      this.email=updateform.email;
      // //console.log(typeof res);
    },(err)=>{
      var res="You are not authorized to perform this action"
      this.message=err;
  }) 
  }

  delete(){
    if(localStorage.getItem("jwt")){
      var r=confirm("Are You sure you want to delete this account")
      if(r==true){
        var x2:any = localStorage.getItem("jwt")
        x2=JSON.parse(x2)
        var token=x2.token;
        var id=x2.user.id;
        //console.log(token)
  
  
        this.http.delete(`http://localhost:3000/api/tempdeleteuser/${id}`)
        .subscribe(res=>{
          var y=JSON.parse(JSON.stringify(res)).msg;
          this.message=y;
          //console.log(res);
          //console.log(y.status)
          localStorage.removeItem("jwt")
          this.http.get("http://localhost:3000/api/signout")
          window.open("/signin", "_self");
          // //console.log(typeof res);
        },(err)=>{
          var y=JSON.parse(JSON.stringify(res)).err;
          this.message=y;
      })
      }
    }

    if(!localStorage.getItem("jwt")){
        var res="You must be logged in first in order to perform delete operation"
        //console.log(res)
      this.message=res;
      }
  }

  signout(){

    
    if(typeof window!=="undefined")
    {
      if(!localStorage.getItem("jwt")){
        if (
          !document.cookie.split(';').filter(item => {
            return item.includes('name=token')
          }).length
        ) {
          //console.log("hello not jwt")
        }
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
        // //console.log(typeof res);
        // //console.log(res);
        this.message=JSON.parse(JSON.stringify(res)).message;
        window.open("/signin", "_self");
      })
      }
    }
    
  }

}
