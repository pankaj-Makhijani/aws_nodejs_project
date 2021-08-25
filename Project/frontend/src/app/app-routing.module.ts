import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { CertificateComponent } from './certificate/certificate.component';
import { HrpanelComponent } from './hrpanel/hrpanel.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

const routes: Routes = [
  {path:"",component:SignupComponent},
  {path:"signin",component:SigninComponent},
  {path:"profile",component:UserprofileComponent},
  {path:"admin",component:AdmindashboardComponent},
  {path:"account",component:AccountComponent},
  {path:"certificate",component:CertificateComponent},
  {path:"hrpanel",component:HrpanelComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
