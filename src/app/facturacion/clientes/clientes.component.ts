import { Component, QueryList, ViewChildren } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Observable, Subject, takeUntil } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormArray,
  Validators,
} from "@angular/forms";

// Sweet Alert
import Swal from "sweetalert2";

import { OrdersService } from "./listjs.service";
import { NgbdOrdersSortableHeader } from "./listjs-sortable.directive";
import {
  ClienteServicesService,
  FacturaServicesService,
} from "src/app/core/services";
import { ToastService } from "src/app/account/login/toast-service";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  providers: [OrdersService, DecimalPipe],
})
export class ClientesComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  listJsForm!: UntypedFormGroup;
  ListJsData!: any[];
  checkedList: any;
  masterSelected!: boolean;
  ListJsDatas: any;

  // Table data
  ListJsList!: Observable<any[]>;
  total: Observable<number>;
  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;

  loading: boolean = false;
  listadoDepartamentos: any[] = [];
  listadoMunicipios: any[] = [];

  constructor(
    private modalService: NgbModal,
    public service: OrdersService,
    private formBuilder: UntypedFormBuilder,
    private serviceFact: FacturaServicesService,
    private apiService: ClienteServicesService,
    public toastService: ToastService
  ) {
    this.ListJsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * Form Validation
     */
    this.listJsForm = this.formBuilder.group({
      nombre: ["", [Validators.required]],
      giro: [""],
      razon_social: [""],
      registro_nrc: [""],
      nrc_file: [""],
      nit: [""],
      id_municipio: [""],
      id_departamento: [""],
      direccion: [""],
      telefono: [""],
      correo: [""],
      dui: [""],
      id_: [0],
    });

    /**
     * fetches data
     */
    this.ListJsList.pipe(takeUntil(this._unsubscribeAll)).subscribe((x) => {
      this.ListJsDatas = Object.assign([], x);
    });
    this.obtenerDEpartamentos();
  }
  obtenerDEpartamentos() {
    this.loading = true;
    this.serviceFact.obtenerDepartamentos().subscribe({
      next: (resp) => {
        var r: any = resp;
        if (r.status) {
          this.listadoDepartamentos = r.data;
        }
        this.loading = false;
      },
      error: (resp) => {
        this.loading = false;
      },
    });
  }

  obtenerMunicipios(valor: any) {
    this.loading = true;
    this.serviceFact.obtenerMunicipios(valor).subscribe({
      next: (resp) => {
        var r: any = resp;
        if (r.status) {
          this.listadoMunicipios = r.data;
        } else {
          this.listadoMunicipios = [];
        }
        this.loading = false;
      },
      error: (resp) => {
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  /**
   * User grid data fetches
   */
  //  private _fetchData() {
  //   this.ListJsData = ListJs;
  //   this.ListJsDatas = Object.assign([], this.ListJsData);
  // }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.listJsForm.reset();
    this.listJsForm.controls["id_"].setValue(0);
    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.listJsForm.controls;
  }

  /**
   * Save saveListJs
   */
  saveListJs() {
    if (this.listJsForm.valid) {
      var id_ = this.form["id_"].value;

      var formData = new FormData();
      if (this.filess != null) {
        formData.append("files", this.filess, this.filess.name);
      }
      formData.append("nombre", this.form["nombre"].value);
      formData.append("giro", this.form["giro"].value);
      formData.append("razon_social", this.form["razon_social"].value);
      formData.append("registro_nrc", this.form["registro_nrc"].value);
      formData.append("nit", this.form["nit"].value);
      formData.append("id_municipio", this.form["id_municipio"].value);
      formData.append("direccion", this.form["direccion"].value);
      formData.append("telefono", this.form["telefono"].value);
      formData.append("correo", this.form["correo"].value);
      formData.append("dui", this.form["dui"].value);

      this.loading = true;
      this.apiService.create(formData, id_).subscribe((resp: any) => {
        this.loading = false;
        this.service.loadRegistros();
        if (resp.status) {
          this.toastService.show(resp.msg, {
            classname: "bg-success text-white",
          });
          this.modalService.dismissAll();
          setTimeout(() => {
            this.listJsForm.reset();
          }, 2000);
        } else {
          this.toastService.show(resp.msg, {
            classname: "bg-danger text-white",
          });
        }
      });
    }
    this.submitted = true;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.ListJsDatas.forEach(
      (x: { state: any }) => (x.state = ev.target.checked)
    );
  }

  /**
   * Confirmation mail model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    this.apiService.delete(id).subscribe((reps: any) => {
      if (reps.status) {
        this.service.loadRegistros();
        this.toastService.show(reps.msg, {
          classname: "bg-success text-white",
        });
      } else {
        this.toastService.show(reps.msg, {
          classname: "bg-danger text-white",
        });
      }
    });
  }
  filess: any = null;
  cargar_files($event: any) {
    this.filess = $event.target.files[0];
  }
  /**
   * Open modal
   * @param content modal content
   */
  editModal(content: any, id: any) {
    let cliente = this.service.listadoClientes.filter(
      (e) => e.id_cliente == id
    )[0];
    let id_departamento =
      cliente.Municipio != null ? cliente.Municipio.id_departamento : "";
    if (id_departamento > 0) {
      let id_municipio =
        cliente.Municipio != null ? cliente.Municipio.id_municipio : "";
      this.obtenerMunicipios(id_departamento);
      setTimeout(() => {
        this.listJsForm.controls["id_municipio"].setValue(id_municipio);
      }, 2000);
    }

    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
    this.listJsForm.controls["nombre"].setValue(cliente.nombre);
    this.listJsForm.controls["giro"].setValue(cliente.giro);
    this.listJsForm.controls["razon_social"].setValue(cliente.razon_social);
    this.listJsForm.controls["registro_nrc"].setValue(cliente.registro_nrc);
    this.listJsForm.controls["nit"].setValue(cliente.nit);
    this.listJsForm.controls["id_departamento"].setValue(id_departamento);
    this.listJsForm.controls["direccion"].setValue(cliente.direccion);
    this.listJsForm.controls["telefono"].setValue(cliente.telefono);
    this.listJsForm.controls["correo"].setValue(cliente.correo);
    this.listJsForm.controls["dui"].setValue(cliente.dui);
    this.listJsForm.controls["id_"].setValue(id);
    setTimeout(() => {
      var updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
      updateBtn.innerHTML = "Actualizar";
    }, 500);
  }
}
