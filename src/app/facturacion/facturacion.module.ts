import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearFacturaComponent } from './crear-factura/crear-factura.component';
import { VerListadoFacturasComponent } from './ver-listado-facturas/ver-listado-facturas.component';
import { AdminRoutingModule } from './facturacion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ToastsContainerFacturacion } from './toasts-container.component';



@NgModule({
  declarations: [
    CrearFacturaComponent,
    VerListadoFacturasComponent,
    ToastsContainerFacturacion
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,  
  ]
})
export class FacturacionModule { }
