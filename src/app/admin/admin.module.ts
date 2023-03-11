import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./catalogo/home/home.component";
import { AdminRoutingModule } from "./admin-routing.module";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import { SharedModule } from "../shared/shared.module";
import { CategoriasComponent } from "./catalogo/categorias/categorias.component";
import { TiposComponent } from "./catalogo/tipos/tipos.component";
import { ToastsContainerAdmin } from "./toasts-container.component";
import { CatalogoComponent } from "./catalogo/catalogo/catalogo.component";
import { ConfigComponent } from "./facturacion/config/config.component";
import { BloquesComponent } from "./facturacion/bloques/bloques.component";
import { HomeConfigComponent } from "./facturacion/home-config/home-config.component";
import { DescuentosComponent } from "./facturacion/descuentos/descuentos.component";

import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  declarations: [
    HomeComponent,
    CategoriasComponent,
    TiposComponent,
    HomeConfigComponent,
    ToastsContainerAdmin,
    CatalogoComponent,
    ConfigComponent,
    BloquesComponent,
    HomeConfigComponent,
    DescuentosComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    NgbPaginationModule,
  ],
})
export class AdminModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
