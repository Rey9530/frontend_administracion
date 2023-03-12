import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  ClienteServicesService,
  FacturaServicesService,
} from "src/app/core/services";
import Swal from "sweetalert2";

@Component({
  selector: "app-ver-facturas-clientes",
  templateUrl: "./ver-facturas-clientes.component.html",
  styles: [],
})
export class VerFacturasClientesComponent {
  invoices: any[] = [];
  showView: boolean = false;

  constructor(
    private apiService: ClienteServicesService,
    private rutaActiva: ActivatedRoute,
    private restApiService: FacturaServicesService
  ) {}
  id: number = 0;
  ngOnInit() {
    this.id = this.rutaActiva.snapshot.params["id"];
    this.cargarFacturas(this.id);
  }

  cargarFacturas(id: any) {
    this.apiService.getFacturas(id).subscribe({
      next: (resp: any) => {
        this.invoices = resp.data;
        setTimeout(() => {
          this.showView = false;
        }, 500);
      },
      error: (resp) => {
        this.showView = false;
      },
    });
  }

  eliminar(id_: number) {
    var data = this.invoices.filter((e: any) => e.id_factura == id_);

    Swal.fire({
      title: "¿Está seguro?",
      text: "Estas por anular la factura: " + data[0].numero_factura,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#364574",
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Si, Anular!",
      cancelButtonText: "No, Cancelar!",
    }).then((result) => {
      if (result.value) {
        this.restApiService.deleteInvoice(id_).subscribe({
          next: (data: any) => {
            this.cargarFacturas(this.id);
            if (data.status) {
              Swal.fire({
                icon: "success",
                text: data.msg,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: data.msg,
              });
            }
          },
          error: (err) => {
            console.log(err); 
            Swal.fire({
              icon: "error",
              text: "Ocurrio un error",
            });
          },
        });
      }
    });
  }
}
