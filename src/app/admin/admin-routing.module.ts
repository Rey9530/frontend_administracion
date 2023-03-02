import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages 
import { RegisterComponent } from '../account/register/register.component';

const routes: Routes = [ 
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  }, 
  {
    path: "home",
    component: RegisterComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
