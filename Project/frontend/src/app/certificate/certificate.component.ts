import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageUploadService } from '../image-upload.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {

  
  constructor(private router:Router,private http:HttpClient,private imageUploadService: ImageUploadService){}
  imageObj: File;
  active:boolean=false;
  accaction:boolean=true;
  certaction:boolean=false;
  imageUrl: string;
  isuser:boolean=false;
  isadmin:boolean=false;
  ishr:boolean=false;
  mngupload:boolean=true;
  mngavail:boolean=false;
  mngaddcert:boolean=false;
  mngrmvcert:boolean=false;
  message:any;
  fname:any;
  lname:any;
  username:any;
  email:any;
  id:any;
  selected:any;
  removeselected:any;
  role:any;
  token:any;
  imgselected:boolean=false;
  objarray2:any[]=[];
  objid2:any[]=[];
  // totalusers:any;
  arrlength2:any;
  objarray3:any[]=[];
  objid3:any[]=[];
  objname3:any[]=[];
  // totalusers:any;
  roles:any;
  arrlength3:any;
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

      // //console.log(this.ishr)
      // //console.log(this.isadmin)
      // //console.log(this.isuser)


      if(!this.roles.includes('user')){
        if(this.roles.includes('admin'))
          window.open("/admin", "_self");

        else if(this.roles.includes('hr'))
          window.open("/hr", "_self");

        else{
          // alert("you dont have any role")
          window.open("/account", "_self");
        }
      }

        }
        if(!localStorage.getItem("jwt")){
          this.active=false
          window.open("/signin", "_self");
        }
        this.objarray2=[];
        this.http.get(`http://localhost:3000/api-cards/getallcards`)
        .subscribe(res=>{
        var y=JSON.parse(JSON.stringify(res));
        ////console.log(y)
        for(var i = 0; i < y.length; i++) {
          var obj = y[i];
          this.arrlength2=i;
          this.objarray2.push(obj)
          this.objid2.push(obj.id)
        }
      })

      this.http.get(`http://localhost:3000/api/getcardbyid/${this.id}`)
      .subscribe(res=>{
      var z=JSON.parse(JSON.stringify(res));
      ////console.log(z.cards)
      this.objarray3=[];
      this.objid3=[];
      this.objname3=[];
      for(var i = 0; i < z.cards.length; i++) {
        var obj = z.cards[i];
        this.arrlength3=i;
        this.objarray3.push(obj)
        this.objid3.push(obj.id)
        this.objname3.push(obj.cardname)
      }
      ////console.log(this.objid3)
      ////console.log(this.objname3)
    })
  }
  
  manageupload(){
    this.message=""
    this.mngupload=true;
    this.mngavail=false;
    this.mngaddcert=false;
    this.mngrmvcert=false;
  }

  manageavail(){
    this.message=""

    this.mngupload=false;
    this.mngavail=true;
    this.mngaddcert=false;
    this.mngrmvcert=false;
  this.ngOnInit();

  }

  manageaddcert(){
    this.message=""
    this.mngupload=false;
    this.mngavail=false;
    this.mngaddcert=true;
    this.mngrmvcert=false;
  this.ngOnInit();

  }

  managermvcert(){
    this.message=""
    this.mngupload=false;
    this.mngavail=false;
    this.mngaddcert=false;
    this.mngrmvcert=true;
  this.ngOnInit();

  }
  
  public onOptionsSelected(event) {
    const value = event.target.value;
    this.selected = value;
    ////console.log(value);
 }


 public onOptionsSelected2(event) {
  const value = event.target.value;
  this.removeselected = value;
  ////console.log(value);
}

  oncardsubmit(addcardform:any){
    ////console.log(addcardform)
    if(localStorage.getItem("jwt")){
      var x2:any = localStorage.getItem("jwt")
      x2=JSON.parse(x2)
      var token=x2.token;
      var id=x2.user.id;
      ////console.log(token)
      addcardform.cid=this.selected
      ////console.log(addcardform)

      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
     });

      // this.http.post(`http://localhost:3000/api-cards/${id}/addcard`,addcardform,{ headers: reqHeader })
      this.http.post(`http://localhost:3000/api-cards/${id}/addcard`,addcardform)
      .subscribe(res=>{
        var y=JSON.parse(JSON.stringify(res));
        this.message=y.msg;
        ////console.log(res);
        this.ngOnInit();
        // ////console.log(typeof res);
      },(err)=>{
        if(err.status>400) {
        ////console.log(err.status)
        var res="You are not authorized to perform this action"
        this.message=res;
        }
    })
    }
    if(!localStorage.getItem("jwt")){
      var res="You must be logged in first in order to perform Delete User operation"
      ////console.log(res)
    this.message=res;
    }
  }

  onremovecardsubmit(removecardform:any){
    ////console.log(removecardform)
    if(localStorage.getItem("jwt")){
      var x2:any = localStorage.getItem("jwt")
      x2=JSON.parse(x2)
      var token=x2.token;
      var id=x2.user.id;
      ////console.log(token)
      removecardform.cid=this.removeselected

      var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
     });

      // this.http.post(`http://localhost:3000/api-cards/${id}/addcard`,addcardform,{ headers: reqHeader })
      this.http.post(`http://localhost:3000/api-cards/${id}/removecard`,removecardform)
      .subscribe(res=>{
        var y=JSON.parse(JSON.stringify(res));
        this.message=y.msg;
        ////console.log(res);
        this.ngOnInit();
        // ////console.log(typeof res);
      },(err)=>{
        if(err.status>400) {
        ////console.log(err.status)
        var res="You are not authorized to perform this action"
        this.message=res;
        }
    })
    }
    if(!localStorage.getItem("jwt")){
      var res="You must be logged in first in order to perform Delete User operation"
      ////console.log(res)
    this.message=res;
    }
  }
  
  onImagePicked(event: Event): void {
    
    const FILE = (event.target as HTMLInputElement).files[0];
    this.imageObj = FILE;
    ////console.log(this.imageObj)
    if(this.imageObj==null){
      this.imgselected=false
      ////console.log(this.imageObj.type)
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
      ////console.log("Uploading image",imageForm)
      this.http.post(`http://localhost:3000/api/upload/${this.id}`, imageForm,{ headers: reqHeader }).subscribe(res => {
        this.imageUrl = JSON.parse(JSON.stringify(res)).image;
        ////console.log(this.imageUrl)
      });
     }
  }

  async onsubmit(updateform:any){
    ////console.log(updateform)

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
      ////console.log(res);
      this.fname=updateform.fname;
      this.lname=updateform.lname;
      this.username=updateform.fname +" "+ updateform.lname;
      this.email=updateform.email;
      this.ngOnInit();
      // ////console.log(typeof res);
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
        ////console.log(token)
  
  
        this.http.delete(`http://localhost:3000/api/tempdeleteuser/${id}`)
        .subscribe(res=>{
          var y=JSON.parse(JSON.stringify(res)).msg;
          this.message=y;
          ////console.log(res);
          ////console.log(y.status)
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
