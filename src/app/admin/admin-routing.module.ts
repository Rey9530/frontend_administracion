import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 

// Component Pages  
import { HomeComponent } from './catalogo/home/home.component';
import { HomeConfigComponent } from './facturacion/home-config/home-config.component';

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
  {
    path: "facturacion_config",
    component: HomeConfigComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
