import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { E404Component } from './e404/e404.component';
 

const routes: Routes = [ 
  // {
  //   path: "",
  //   pathMatch: "full",
  //   redirectTo: "404",
  // },
  {
    path: "404",
    component: E404Component
  },
  // {
  //   path: "login",
  //   component: LoginComponent
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }
