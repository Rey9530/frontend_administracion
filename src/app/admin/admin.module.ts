import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { AdminRoutingModule } from "./admin-routing.module";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbNavModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { CategoriasComponent } from "./catalogo/categorias/categorias.component";
import { TiposComponent } from "./catalogo/tipos/tipos.component"; 
import { ToastsContainerAdmin } from "./toasts-container.component";

@NgModule({
  declarations: [
    HomeComponent,
    CategoriasComponent,
    TiposComponent, 
    ToastsContainerAdmin
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbNavModule,
    NgbToastModule,
  ],
})
export class AdminModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
