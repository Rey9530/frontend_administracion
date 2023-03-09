import { Component, QueryList, ViewChildren } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Observable, Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from "@angular/forms";

// Sweet Alert
import Swal from "sweetalert2";

// Date Format
import { DatePipe } from "@angular/common";

import { ListService } from "./list.service";
import { NgbdListSortableHeader, SortEvent } from "./list-sortable.directive";
import { FacturaServicesService } from "src/app/core/services";
import { FlatpickrDefaults } from "angularx-flatpickr";

// Rest Api Service

@Component({
  selector: "app-ver-listado-facturas",
  templateUrl: "./ver-listado-facturas.component.html",
  styles: [],
  providers: [ListService, DecimalPipe, FlatpickrDefaults],
})
export class VerListadoFacturasComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Table data
  invoicesList!: Observable<any[]>;
  total: Observable<number>;
  @ViewChildren(NgbdListSortableHeader)
  headers!: QueryList<NgbdListSortableHeader>;
  CustomersData!: any[];
  masterSelected!: boolean;
  checkedList: any;

  fechahRango: any;

  // Api Data
  content?: any;
  econtent?: any;
  invoices?: any;

  constructor(
    private modalService: NgbModal,
    public service: ListService,
    private restApiService: FacturaServicesService,
    private datePipe: DatePipe
  ) {
    this.invoicesList = service.countries$;
    this.total = service.total$;
  }
  subscription1$: Subscription = new Subscription();
  ngOnInit(): void {
    this.fechahRango = { from: new Date(), to: new Date() };
    /**
     * fetches data
     */
    setTimeout(() => {
      this.subscription1$ = this.invoicesList.subscribe((x) => {
        this.content = this.invoices;
        this.invoices = Object.assign([], x);
        //TODO: esto tiene un siclo secomentar la siguiente lina para verlo en consola
        // console.log(this.invoices);
      });
      document.getElementById("elmLoader")?.classList.add("d-none");
    }, 1200);
  }
  ngOnDestroy() {
    this.subscription1$.unsubscribe();
  }

  /**
   * Confirmation mail model
   */
  deleteId: any;
  numeroFactura: any;
  confirm(content: any, id: any, numero: any) {
    this.deleteId = id;
    this.numeroFactura = numero;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    if (id) {
      this.restApiService.deleteInvoice(id).subscribe({
        next: (data: any) => {
          if (data.status) {
            this.SearchData();
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
          this.content = JSON.parse(err.error).message;
        },
      });
    } 
  }
 
  // Filtering
  isstatus?: any;
  SearchData() {
    document.getElementById("elmLoader")?.classList.remove("d-none");
    this.service.loadFacturas();
    setTimeout(() => {
      document.getElementById("elmLoader")?.classList.add("d-none");
    }, 1000);
  }
}
