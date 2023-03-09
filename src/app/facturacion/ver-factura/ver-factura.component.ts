import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FacturaServicesService } from "src/app/core/services";

@Component({
  selector: "app-ver-factura",
  templateUrl: "./ver-factura.component.html",
  styles: [],
})
export class VerFacturaComponent implements OnInit {
  showView = false;
  data: any;
  constructor(
    private service: FacturaServicesService,
    private rutaActiva: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    var id = this.rutaActiva.snapshot.params["id"];
    this.obtenerData(id);
  }

  obtenerData(id: any) {
    this.showView = true;
    this.service.getInvoice(id).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.data = resp;
        setTimeout(() => {
          this.showView = false;
        }, 500);
      },
      error: (resp) => {
        this.showView = false;
      },
    });
  }
  back(): void {
    this.router.navigate(["/facturacion/ver_listado"]);
  }
}
