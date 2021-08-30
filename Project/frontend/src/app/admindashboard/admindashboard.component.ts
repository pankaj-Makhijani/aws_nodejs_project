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
  mngcreateuser:boolean=true;
  mngupdateuser:boolean=false;
  mngdeleteuser:boolean=false;
  mnggetuser:boolean=false;
  mngcreatecert:boolean=false;
  mngdeletecert:boolean=false;
  mnggetcert:boolean=false;
  mnggetlogs:boolean=false;

  isuser:boolean=false;
  isadmin:boolean=false;
  ishr:boolean=false;
  logsarray1:any[]=[];
  logslength1:any;
  logsarray2:any[]=[];
  logslength2:any;
  emailarray:string[]=[];
  idarray:string[]=[];
  objarray:any[]=[];
  arrlength:any;
  objarray2:any[]=[];
  certarray:any[]=[];
  users:any[]=[];
  certname:any;
  certlength:any;
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
  selected:any;
  selected2:any;
  removeselected:any;
  imgselected:boolean=true;
  ngOnInit(): void {
        if(localStorage.getItem("jwt")){
          var w:any = localStorage.getItem("jwt")
          
      this.active=true;
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
        this.ishr=true;
      }
      if(this.role==0){
        this.isadmin=false;
        this.ishr=false;
        this.isuser=true;
        window.open("/profile", "_self");
      }
      if(this.role==2){
        this.isadmin=false;
        this.ishr=true;
        this.isuser=true;
        window.open("/hrpanel", "_self");
      }

    //fetch all users from backend
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
        }
        }

      },(err)=>{
        if(err.status>400) {
          console.log(err.status)
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
    
    //fetch all certificates from backend

    //fetch all system logs
    this.logsarray1=[];
    this.logslength1=0;
     this.http.get(`http://localhost:3000/api/getactivitylogs`)
     .subscribe(res=>{
       var y=JSON.parse(JSON.stringify(res));
       console.log(y)
       this.logsarray1=[];
       this.logslength1=0;
       if(y.length==0){
       this.logslength1=0;
         this.message="There aren't any logs stored in the Database"
       }
       else{
         for(var i = 0; i <= y.length; i++) {
           var obj = y[i];
           this.logslength1=i;
           this.logsarray1.push(obj)
       }
       console.log(this.logsarray1)
       }
   }),(err)=>{
       if(err.status>400) {
         console.log(err.status)
         var res="You are not authorized to perform this action"
         this.message=res;
         }
   }
    //fetch all system logs
    //fetch all activity logs

    //fetch all activity logs

        }
        if(!localStorage.getItem("jwt")){
          window.open("/signin", "_self");
        }  
  }
  

  managecreateuser(){
    this.message="";
  
    this.mngcreateuser=true
    this.mngupdateuser=false;
  this.mngdeleteuser=false;
  this.mnggetuser=false;
  this.mngcreatecert=false;
  this.mngdeletecert=false;
  this.mnggetcert=false;
  this.mnggetlogs=false;
  }

  manageupdateuser(){
    this.message="";

    this.mngcreateuser=false
    this.mngupdateuser=true;
  this.mngdeleteuser=false;
  this.mnggetuser=false;
  this.mngcreatecert=false;
  this.mngdeletecert=false;
  this.mnggetcert=false;
  }

  managedeleteuser(){
    this.message="";

    this.mngcreateuser=false;
    this.mngupdateuser=false;
  this.mngdeleteuser=true;
  this.mnggetuser=false;
  this.mngcreatecert=false;
  this.mngdeletecert=false;
  this.mnggetcert=false;
  this.mnggetlogs=false;
  }

  managegetuser(){
    this.message="";

    this.mngcreateuser=false;
    this.mngupdateuser=false;
  this.mngdeleteuser=false;
  this.mnggetuser=true;
  this.mngcreatecert=false;
  this.mngdeletecert=false;
  this.mnggetcert=false;
  this.mnggetlogs=false;
  }

  managecreatcert(){
    this.message="";
    this.mngcreateuser=false;
    this.mngupdateuser=false;
  this.mngdeleteuser=false;
  this.mnggetuser=false;
  this.mngcreatecert=true;
  this.mngdeletecert=false;
  this.mnggetcert=false;
  this.mnggetlogs=false;
  }

  managedeletecert(){
    this.message="";
    this.removeselected=""
    this.mngcreateuser=false;
    this.mngupdateuser=false;
  this.mngdeleteuser=false;
  this.mnggetuser=false;
  this.mngcreatecert=false;
  this.mngdeletecert=true;
  this.mnggetlogs=false;
  this.mnggetcert=false;
  }

  managegetcert(){
    this.message="";
    this.removeselected=""

    this.mngcreateuser=false;
    this.mngupdateuser=false;
  this.mngdeleteuser=false;
  this.mnggetuser=false;
  this.mngcreatecert=false;
  this.mngdeletecert=false;
  this.mnggetcert=true;
  this.mnggetlogs=false;
  }

  managegetlogs(){
    this.message="";
    this.mngcreateuser=false;
    this.mngupdateuser=false;
  this.mngdeleteuser=false;
  this.mnggetuser=false;
  this.mngcreatecert=false;
  this.mngdeletecert=false;
  this.mnggetlogs=true;
  this.mnggetcert=false;
  }

  public onOptionsSelected(event) {
    const value = event.target.value;
    this.selected = value;
    console.log(value);
 }

 public onOptionsSelected2(event) {
  const value = event.target.value;
  this.selected2 = value;
  console.log(value);
}

public onOptionsSelected3(event) {
  const cardid = event.target.value;
  this.removeselected = cardid;
  console.log(cardid);
  // this.certarray=[];
  //    this.certlength=0;
  //     this.http.get(`http://localhost:3000/api-cards/${cardid}/getallcards`)
  //     .subscribe(res=>{
  //       var y=JSON.parse(JSON.stringify(res));
  //       console.log(y)
  //       this.certarray=[];
  //       this.certlength=0;
  //       this.users=[];
  //       this.certname="";
  //       // this.noofusers=0;
        
  //         this.noofusers=y.length;
  //         for(var i = 0; i <= y.length; i++) {
  //           var obj = y[i];
  //           this.certlength=i;
  //           this.certname=obj.cardname;
  //           this.users.push(obj.users);
  //           console.log(this.users)
  //           // console.log(certname)
  //           this.certarray.push(obj)
  //       }
        
        

  //     },(err)=>{
  //       if(err.status>400) {
  //         console.log(err.status)
  //         var res="You are not authorized to perform this action"
  //         this.message=res;
  //         }
  //   })

}

  onsubmit(deleteform:any){
    deleteform.id=this.selected2;
    


    if(localStorage.getItem("jwt")){
      if(deleteform.id==undefined){
        this.message="Please select user"
      }
      else{
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
            this.ngOnInit();
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
      this.ngOnInit();
    })
    
  }

  // onclick(){
  //   if(localStorage.getItem("jwt")){
  //     var x:any = localStorage.getItem("jwt")
  //     x=JSON.parse(x)
  //     var id=x.user.id;
  //     this.username=x.user.firstname
  //     var token=x.token;
  //     console.log(id)
  //     console.log(token)

  //     var reqHeader = new HttpHeaders({ 
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //    });
  //    this.objarray=[];
  //    this.arrlength=0;
  //     this.http.get(`http://localhost:3000/api/${id}/findallusers`,{ headers: reqHeader })
  //     .subscribe(res=>{
  //       var y=JSON.parse(JSON.stringify(res));
  //       console.log(y)
  //       this.objarray=[];
  //       this.arrlength=0;
  //       // this.noofusers=0;
  //       if(y.length==0){
  //         this.noofusers="no";
  //       }
  //       else{
  //         this.noofusers=y.length;
  //         for(var i = 0; i <= y.length; i++) {
  //           var obj = y[i];
  //           this.arrlength=i;
  //           this.objarray.push(obj)
  //       }
  //       }

  //     },(err)=>{
  //       if(err.status>400) {
  //         console.log(err.status)
  //         var res="You are not authorized to perform this action"
  //         this.message=res;
  //         }
  //   })
  //   }
  //   if(!localStorage.getItem("jwt")){
  //    var res="You must be logged in first in order to perform Find all users operation"
  //    console.log(res)
  //   this.message=res;
  //   }
  // }

  oncardsubmit(cardform:any){
    this.message="";
    this.http.post(`http://localhost:3000/api-cards/createcard`, cardform)
    .subscribe(res => {
        this.message = JSON.parse(JSON.stringify(res)).msg;
        this.ngOnInit();
      }),(err)=>{
        this.message = "Cannot create card";
      }
  }

  oncarddelete(carddeleteform:any){
    this.message="";
    carddeleteform.cardid=this.removeselected
    console.log(carddeleteform)
    this.http.post(`http://localhost:3000/api-cards/deletecardbyid`, carddeleteform)
    .subscribe(res => {
        this.message = JSON.parse(JSON.stringify(res)).msg;
        this.ngOnInit();
      })
  }

  ongetalldetails(){
    this.message="";
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
        var x:any = localStorage.getItem("jwt")
        x=JSON.parse(x)
        var id=x.user.id;
        localStorage.removeItem("jwt")
        this.http.get(`http://localhost:3000/api/${id}/signout`).subscribe(res=>{
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
    updateform.uid=this.selected;
    console.log(updateform)
    this.message="";
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
      this.ngOnInit();
    },(err)=>{
      var res="You are not authorized to perform this action"
      this.message=err;
  }) 
  }
}
