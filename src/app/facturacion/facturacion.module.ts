import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { CrearFacturaComponent } from "./crear-factura/crear-factura.component";
import { VerListadoFacturasComponent } from "./ver-listado-facturas/ver-listado-facturas.component";
import { AdminRoutingModule } from "./facturacion-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { ToastsContainerFacturacion } from "./toasts-container.component";
import { CountToModule } from "angular-count-to";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { FlatpickrModule } from "angularx-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";

import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";
import { VerFacturaComponent } from './ver-factura/ver-factura.component';
import { ClientesComponent } from './clientes/clientes.component';
import { VerFacturasClientesComponent } from './ver-facturas-clientes/ver-facturas-clientes.component';

@NgModule({
  declarations: [
    CrearFacturaComponent,
    VerListadoFacturasComponent,
    ToastsContainerFacturacion,
    VerFacturaComponent,
    ClientesComponent,
    VerFacturasClientesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    CountToModule, 
    FlatpickrModule.forRoot({ locale: Spanish }),
    FeatherModule.pick(allIcons),
    AdminRoutingModule,
    SharedModule,
    AutocompleteLibModule
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FacturacionModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
