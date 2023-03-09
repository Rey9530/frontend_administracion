import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LayoutComponent } from "./layouts/layout.component";

// Auth
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/auth/login",
  },
  {
    path: "admin",
    component: LayoutComponent,
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: "reportes",
    loadChildren: () =>
      import("./reportes/reportes.module").then((m) => m.ReportesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "facturacion",
    component: LayoutComponent,
    loadChildren: () =>
      import("./facturacion/facturacion.module").then(
        (m) => m.FacturacionModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "errors",
    loadChildren: () =>
      import("./errors/errors.module").then((m) => m.ErrorsModule),
  },
  { path: "**", pathMatch: "full", redirectTo: "/errors/404" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
