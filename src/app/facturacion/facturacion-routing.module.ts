import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { CrearFacturaComponent } from './crear-factura/crear-factura.component';
import { VerListadoFacturasComponent } from './ver-listado-facturas/ver-listado-facturas.component';

// Component Pages   

const routes: Routes = [ 
  {
    path: "",
    pathMatch: "full",
    redirectTo: "ver_listado",
  }, 
  {
    path: "crear",
    component: CrearFacturaComponent
  }, 
  
  {
    path: "ver_listado",
    component: VerListadoFacturasComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }