import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientesComponent } from "./clientes/clientes.component";
import { CrearFacturaComponent } from "./crear-factura/crear-factura.component";
import { VerFacturaComponent } from "./ver-factura/ver-factura.component";
import { VerFacturasClientesComponent } from "./ver-facturas-clientes/ver-facturas-clientes.component";
import { VerListadoFacturasComponent } from "./ver-listado-facturas/ver-listado-facturas.component";

// Component Pages

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "ver_listado",
  },
  {
    path: "crear",
    component: CrearFacturaComponent,
  },

  {
    path: "ver_listado",
    component: VerListadoFacturasComponent,
  },
  {
    path: "factura/:id",
    component: VerFacturaComponent,
  },
  {
    path: "clientes",
    component: ClientesComponent,
  },

  {
    path: "clientes/facturas/:id",
    component: VerFacturasClientesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
