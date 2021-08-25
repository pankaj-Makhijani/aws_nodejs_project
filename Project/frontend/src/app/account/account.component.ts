
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
  ngOnInit(): void {
        if(localStorage.getItem("jwt")){
      var w:any = localStorage.getItem("jwt")
      w=JSON.parse(w)
      this.fname=w.user.firstname;
      this.lname=w.user.lastname;
      this.username=w.user.firstname +" "+ w.user.lastname;
      this.email=w.user.email;
      this.role=w.user.role;
      this.id=w.user.id;
      this.token=w.token;
      if(this.role==1){
        this.isadmin=true;
        this.isuser=true;
        this.ishr=true
      }
      if(this.role==0){
        this.isadmin=false;
        this.isuser=true;
        this.ishr=false;
      }
      if(this.role==2){
        this.isadmin=false;
        this.isuser=true;
        this.ishr=true;
      }
        }
        if(!localStorage.getItem("jwt")){
          window.open("/signin", "_self");
        }

        this.http.get(`http://localhost:3000/api-cards/getallcards`)
        .subscribe(res=>{
        var y=JSON.parse(JSON.stringify(res));
        console.log(y)
        for(var i = 0; i <= y.length; i++) {
          var obj = y[i];
          this.arrlength2=i;
          this.objarray2.push(obj)
          this.objid2.push(obj.id)
        }
      })
  }
  
  
  
  oncardsubmit(addcardform:any){
    console.log(addcardform)
    if(localStorage.getItem("jwt")){
      var x2:any = localStorage.getItem("jwt")
      x2=JSON.parse(x2)
      var token=x2.token;
      var id=x2.user.id;
      console.log(token)

      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
     });

      // this.http.post(`http://localhost:3000/api-cards/${id}/addcard`,addcardform,{ headers: reqHeader })
      this.http.post(`http://localhost:3000/api-cards/${id}/addcard`,addcardform)
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
    if(!localStorage.getItem("jwt")){
      var res="You must be logged in first in order to perform Delete User operation"
      console.log(res)
    this.message=res;
    }
  }

  onremovecardsubmit(removecardform:any){
    console.log(removecardform)
    if(localStorage.getItem("jwt")){
      var x2:any = localStorage.getItem("jwt")
      x2=JSON.parse(x2)
      var token=x2.token;
      var id=x2.user.id;
      console.log(token)

      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
     });

      // this.http.post(`http://localhost:3000/api-cards/${id}/addcard`,addcardform,{ headers: reqHeader })
      this.http.post(`http://localhost:3000/api-cards/${id}/removecard`,removecardform)
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
    if(!localStorage.getItem("jwt")){
      var res="You must be logged in first in order to perform Delete User operation"
      console.log(res)
    this.message=res;
    }
  }
  
  onImagePicked(event: Event): void {
    
    const FILE = (event.target as HTMLInputElement).files[0];
    this.imageObj = FILE;
    console.log(this.imageObj)
    if(this.imageObj==null){
      this.imgselected=false
      console.log(this.imageObj.type)
      this.message="Please select image before uploading"
    }
    else if(this.imageObj!=null && this.imageObj.type!="image/jpeg"){
      this.imgselected=false
     this.message="Please select files having .jpeg format"
   }
    else if(this.imageObj!=null && this.imageObj.type=="image/jpeg"){
      this.imgselected=true;
    }
  }

  

  onImageUpload() {
      var reqHeader = new HttpHeaders({ 
        'Authorization': `Bearer ${this.token}`
     });

     
     if(this.imageObj!=null && this.imageObj.type=="image/jpeg"){
       this.imgselected=true;
      const imageForm = new FormData();
      imageForm.append('image', this.imageObj);
      console.log("Uploading image",imageForm)
      this.http.post(`http://localhost:3000/api/upload/${this.id}`, imageForm,{ headers: reqHeader }).subscribe(res => {
        this.imageUrl = JSON.parse(JSON.stringify(res)).image;
        console.log(this.imageUrl)
      });
     }
  }

  async onsubmit(updateform:any){
    console.log(updateform)

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
      console.log(res);
      this.fname=updateform.fname;
      this.lname=updateform.lname;
      this.username=updateform.fname +" "+ updateform.lname;
      this.email=updateform.email;
      // console.log(typeof res);
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
        console.log(token)
  
  
        this.http.delete(`http://localhost:3000/api/tempdeleteuser/${id}`)
        .subscribe(res=>{
          var y=JSON.parse(JSON.stringify(res)).msg;
          this.message=y;
          console.log(res);
          console.log(y.status)
          localStorage.removeItem("jwt")
          this.http.get("http://localhost:3000/api/signout")
          window.open("/signin", "_self");
          // console.log(typeof res);
        },(err)=>{
          var y=JSON.parse(JSON.stringify(res)).err;
          this.message=y;
      })
      }
    }

    if(!localStorage.getItem("jwt")){
        var res="You must be logged in first in order to perform delete operation"
        console.log(res)
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
          console.log("hello not jwt")
        }
        var res="You must be logged in first in order to perform signout operation"
        console.log(res)
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

  //Logic for creating card by showing card name in drop down menu
//   <form #addcardform="ngForm" (ngSubmit)="oncardsubmit(addcardform.value)">
//   <select name="cid">
//    <option *ngFor="let o of objarray2" [ngValue]="o.id">{{o.id}}</option>
//   </select>
//     <input type="submit" value="Submit">
// </form>

//  Logic by inputing Card import {  } from '<form #addcardform="ngForm" (ngSubmit)="oncardsubmit(addcardform.value)">
    
//  <label for="cid">Certificate ID:
//      <input type="number" id="cid" name="cid" ngModel>
//      </label>
//      <input type="submit" value="Submit">
// </form>'


mngcert(){
  this.accaction=false;
  this.certaction=true;
}

mngacc(){
  this.accaction=true;
  this.certaction=false;
}
}
