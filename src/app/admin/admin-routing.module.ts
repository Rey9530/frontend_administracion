import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 

// Component Pages  
import { HomeComponent } from './home/home.component';

const routes: Routes = [ 
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  }, 
  {
    path: "home",
    component: HomeComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
