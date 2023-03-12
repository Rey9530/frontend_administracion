import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pipe,
  Subject,
  switchMap,
} from "rxjs";
import { ToastService } from "src/app/account/login/toast-service";
import { DetalleFactura } from "src/app/core/models";
import {
  BloquesServicesService,
  ClienteServicesService,
  DescuentosServicesService,
  FacturaServicesService,
  SistemaServicesService,
} from "src/app/core/services";

@Component({
  selector: "app-crear-factura",
  templateUrl: "./crear-factura.component.html",
  styles: [],
})
export class CrearFacturaComponent implements OnInit {
  // bread crumb items
  submitted = false;
  showView = false;
  loading = false;
  datosSistema: any;
  listadoTipos: any = [];
  listadoTiposDescuentos: any = [];
  listadoDeDetalle: DetalleFactura[] = [];

  InvoicesForm!: UntypedFormGroup;
  paymentSign = "$";
  userForm: UntypedFormGroup;
  date: Date = new Date();
  fechashow: string = "";
  noFactura: string = "0";
  tipoFactura: number = 1;

  //ubicacion
  listadoDepartamentos: any[] = [];
  listadoMunicipios: any[] = [];

  //metodo de pago
  listadoMethodosPago: any[] = [];
  metodoPago: number = 0;
  //parabuscar
  itemSeleccionado: number = 0;
  selectedAccount: string[] = [];
  listadoDeCatalogos: any[] = [];
  listadoCatalogosLoading: any[] = [];

  searchSubject$ = new Subject<void>();
  debouncedPing$ = this.searchSubject$.pipe(
    debounceTime(1000),
    switchMap((query: any) => {
      var datos = { query };
      return this.service.buscarEnCatalago(datos);
    })
  );

  buscarCliente = new Subject<void>();
  debouncedCliente = this.buscarCliente.pipe(
    debounceTime(1000),
    switchMap((query: any) => {
      var datos = { query };
      return this.service.buscarClientes(datos);
    })
  );

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: FacturaServicesService,
    private serviceSistema: SistemaServicesService,
    private serviceDescuentos: DescuentosServicesService,
    private serviceTiFactura: BloquesServicesService,
    public toastService: ToastService,
    private modalService: NgbModal,
    private apiService: ClienteServicesService
  ) {
    this.userForm = this.formBuilder.group({
      items: this.formBuilder.array([this.formBuilder.control(null)]),
    });

    this.rearmarFormulario(1);
  }
  execKeypress($event: any, index: number) {
    this.itemSeleccionado = index;
    // When remote, clear all items directly on keypress. Else we have an ugly lag because of the debounce time.
    if ($event.term.length < 3) return;
    this.listadoCatalogosLoading[index] = true;
    this.searchSubject$.next($event.term);
  }
  seleccionarItem(data: any) {
    // When remote, clear all items directly on keypress. Else we have an ugly lag because of the debounce time.
    if (data != undefined && data != null) {
      this.listadoDeDetalle[this.itemSeleccionado].cantidad = data.cantidad;
      this.listadoDeDetalle[this.itemSeleccionado].nombre = data.nombre;
      this.listadoDeDetalle[this.itemSeleccionado].codigo = data.codigo;
      this.listadoDeDetalle[this.itemSeleccionado].id_catalogo =
        data.id_catalogo;
      this.listadoDeDetalle[this.itemSeleccionado].precio_con_iva =
        data.precio_con_iva;
      this.listadoDeDetalle[this.itemSeleccionado].precio_sin_iva =
        data.precio_sin_iva;
      this.listadoDeDetalle[this.itemSeleccionado].cantidad = 1;
      this.listadoDeDetalle[this.itemSeleccionado].total = 0;
      this.listadoDeDetalle[this.itemSeleccionado].subtotal = 0;
      this.listadoDeDetalle[this.itemSeleccionado].iva = 0;
    }

    this.recalculateCart();
  }
  ngOnInit(): void {
    this.obtenerDEpartamentos();
    this.obtenerListadoDeTipos();
    this.obtenerMetodosPago();
    this.obtenerListadoDeTiposDescuentos();
    this.obtenerDataSistem();
    this.cargarNoFacturaEvent();
    var options: any = { year: "numeric", month: "long", day: "numeric" };
    this.fechashow = this.date.toLocaleDateString("es-ES", options);

    this.debouncedPing$.subscribe((res: any) => {
      this.listadoCatalogosLoading[this.itemSeleccionado] = false;
      if (res.status) {
        this.listadoDeCatalogos[this.itemSeleccionado] = res.data;
      } else {
        this.listadoDeCatalogos[this.itemSeleccionado] = [];
      }
    });

    this.debouncedCliente.subscribe((res: any) => {
      if (res.status) {
        this.listadoClientes = res.data;
      } else {
        this.listadoClientes = [];
      }
    });

    /**
     * Form Validation ára clientes
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
  }

  obtenerListadoDeTipos() {
    this.loading = true;
    this.serviceTiFactura.getTiposFactural().subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.listadoTipos = r.data;
        } else {
          this.toastService.show("Ocurrio un error al cargar la información", {
            classname: "bg-danger text-white",
          });
        }
      },
      error: (resp) => {
        this.loading = false;
        this.toastService.show("Ocurrio un error al cargar la información", {
          classname: "bg-danger text-white",
        });
      },
    });
  }
  obtenerListadoDeTiposDescuentos() {
    this.loading = true;
    this.serviceDescuentos.getActives().subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.listadoTiposDescuentos = r.data;
        } else {
          this.toastService.show("Ocurrio un error al cargar la información", {
            classname: "bg-danger text-white",
          });
        }
      },
      error: (resp) => {
        this.loading = false;
        this.toastService.show("Ocurrio un error al cargar la información", {
          classname: "bg-danger text-white",
        });
      },
    });
  }
  obtenerDataSistem() {
    this.showView = true;
    this.serviceSistema.getData().subscribe({
      next: (resp: any) => {
        this.datosSistema = resp.data;
        setTimeout(() => {
          this.showView = false;
        }, 500);
      },
      error: (resp) => {
        this.showView = false;
        this.toastService.show("Ocurrio un error al cargar la información", {
          classname: "bg-danger text-white",
        });
      },
    });
  }
  rearmarFormulario(id_: number) {
    var valores = null;
    if (this.InvoicesForm != null) {
      valores = this.InvoicesForm.value;
    }
    if (id_ == 1) {
      // consumidor final
      this.InvoicesForm = this.formBuilder.group({
        cliente: ["", [Validators.required]],
        direccion: ["", [Validators.required]],
        id_tipo_factura: [id_, [Validators.required]],
        no_registro: [""],
        cliente_search: [""],
        correo: [""],
        telefono: [""],
        dui: [""],
        razon_social: [""],
        nit: [""],
        giro: [""],
        id_departamento: [""],
        id_municipio: [""],
        subtotal: [0],
        descuento: [0],
        iva: [0],
        total: [0],
        id_cliente: [0],
      });
    } else {
      // credito fiscal
      this.InvoicesForm = this.formBuilder.group({
        cliente: ["", [Validators.required]],
        direccion: ["", [Validators.required]],
        no_registro: ["", [Validators.required]],
        nit: ["", [Validators.required]],
        giro: ["", [Validators.required]],
        id_municipio: ["", [Validators.required]],
        id_tipo_factura: [id_, [Validators.required]],

        correo: [""],
        telefono: [""],
        dui: [""],
        razon_social: [""],

        cliente_search: [""],
        id_departamento: [""],
        subtotal: [0],
        descuento: [0],
        iva: [0],
        total: [0],
        id_cliente: [0],
      });
    }
    if (valores) {
      valores.id_tipo_factura = id_;
      this.InvoicesForm.patchValue(valores);
    }
  }
  cargarNoFactura(_t38: HTMLSelectElement) {
    this.tipoFactura = parseInt(_t38.value);
    this.recalculateCart();
    this.rearmarFormulario(this.tipoFactura);
    this.loading = true;
    this.cargarNoFacturaEvent();
  }

  cargarNoFacturaEvent() {
    this.loading = true;
    this.service.getDataBloque(this.tipoFactura).subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.noFactura = r.data.Bloques.actual;
        } else {
          this.noFactura = "0";
          this.toastService.show(r.msg, {
            classname: "bg-danger text-white",
          });
        }
      },
      error: (resp) => {
        this.loading = false;
        this.toastService.show("Ocurrio un error al cargar la información", {
          classname: "bg-danger text-white",
        });
      },
    });
  }
  obtenerDEpartamentos() {
    this.service.obtenerDepartamentos().subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.listadoDepartamentos = r.data;
        } else {
          this.toastService.show(r.msg, {
            classname: "bg-danger text-white",
          });
        }
      },
      error: (resp) => {
        this.loading = false;
        this.toastService.show("Ocurrio un error al cargar la información", {
          classname: "bg-danger text-white",
        });
      },
    });
  }
  obtenerMunicipios(valor: any) {
    this.loading = true;
    this.service.obtenerMunicipios(valor).subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.listadoMunicipios = r.data;
        } else {
          this.listadoMunicipios = [];
          this.toastService.show(r.msg, {
            classname: "bg-danger text-white",
          });
        }
      },
      error: (resp) => {
        this.loading = false;
        this.toastService.show("Ocurrio un error al cargar la información", {
          classname: "bg-danger text-white",
        });
      },
    });
  }
  obtenerMetodosPago() {
    this.recalculateCart();
    this.loading = true;
    this.service.obtenerMetodosDePago().subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.listadoMethodosPago = r.data;
        } else {
          this.listadoMethodosPago = [];
          this.toastService.show(r.msg, {
            classname: "bg-danger text-white",
          });
        }
      },
      error: (resp) => {
        this.loading = false;
        this.toastService.show("Ocurrio un error al cargar la información", {
          classname: "bg-danger text-white",
        });
      },
    });
  }

  /**
   * Form data get
   */
  get form() {
    return this.InvoicesForm.controls;
  }

  // Default
  increment(index: number) {
    this.listadoDeDetalle[index].cantidad++;
    this.recalculateCart();
  }
  decrement(index: number) {
    if (this.listadoDeDetalle[index].cantidad > 0) {
      this.listadoDeDetalle[index].cantidad--;
      this.recalculateCart();
    }
  }

  subtotal: number = 0;
  iva: number = 0;
  descuento: number = 0;
  id_descuento: number = 0;
  total: number = 0;
  montoTotal: number = 0;
  recalculateCart() {
    this.subtotal = 0;
    this.iva = 0;
    this.descuento = 0;
    this.total = 0;
    this.listadoDeDetalle.map((e) => {
      var monto = 0;
      monto = e.cantidad * e.precio_con_iva;
      if (this.tipoFactura == 2) {
        monto = monto / (this.datosSistema.impuesto + 1);
      }
      e.subtotal = Number(monto.toFixed(2));
      e.descuento = 0;
      if (e.id_descuento > 0) {
        var descuento = this.listadoTiposDescuentos.filter(
          (ele: any) => ele.id_descuento == e.id_descuento
        );
        if (descuento.length > 0) {
          e.descuento = Number(
            ((descuento[0].porcentaje / 100) * monto).toFixed(2)
          );
          e.descuento = Number(e.descuento.toFixed(2));
          monto = monto - e.descuento;
        }
      }
      e.total = Number(monto.toFixed(2));
      this.subtotal += Number(monto.toFixed(2));

      if (this.tipoFactura == 2) {
        monto = monto * (this.datosSistema.impuesto + 1);
      }
      this.total += Number(monto.toFixed(2));
    });

    if (this.tipoFactura == 2) {
      var impuesto = this.datosSistema.impuesto + 1;
      this.iva = this.total - this.total / impuesto;
      this.iva = Number(this.iva.toFixed(2));
      this.subtotal = this.total - this.iva;

      if (this.id_descuento > 0) {
        var descuento = this.listadoTiposDescuentos.filter(
          (ele: any) => ele.id_descuento == this.id_descuento
        );
        if (descuento.length > 0) {
          this.descuento = (descuento[0].porcentaje / 100) * this.subtotal;
          var nuevoSubtotal = this.subtotal - this.descuento;

          this.iva = nuevoSubtotal * impuesto - nuevoSubtotal;
          this.iva = Number(this.iva.toFixed(2));
          this.total = this.total - this.descuento;
        }
      }
    } else {
      if (this.id_descuento > 0) {
        var descuento = this.listadoTiposDescuentos.filter(
          (ele: any) => ele.id_descuento == this.id_descuento
        );
        if (descuento.length > 0) {
          this.descuento = (descuento[0].porcentaje / 100) * this.total;
        }
      }
      this.total = this.total - this.descuento;
    }
    this.montoTotal = this.total;
  }

  efectivo: any = 0;
  cambio: any = 0;
  tarjeta: any = 0;
  cheque: any = 0;
  transferencia: any = 0;
  credito: any = 0;
  asignarMethodoDePago(metodosPago: any) {
    this.metodoPago = Number(metodosPago.value);

    this.efectivo = "";
    this.cambio = 0;
    this.tarjeta = "";
    this.cheque = "";
    this.transferencia = "";
    this.credito = "";
    switch (this.metodoPago) {
      case 1:
        this.efectivo = "";
        break;
      case 2:
        this.tarjeta = this.montoTotal;
        break;
      case 3:
        this.cheque = this.montoTotal;
        break;
      case 4:
        this.transferencia = this.montoTotal;
        break;
      case 6:
        this.credito = this.montoTotal;
        break;
      default:
        break;
    }
  }

  calcularCambio() {
    var montoTotal =
      this.montoTotal -
      this.tarjeta -
      this.cheque -
      this.transferencia -
      this.credito;
    this.cambio = this.efectivo - montoTotal;
  }

  asignarDescuento(event: any, i: number) {
    this.listadoDeDetalle[i].id_descuento = Number(event.value);
    this.recalculateCart();
  }
  asignarDescuentoGlobal(i: any) {
    this.id_descuento = Number(i.value);
    this.recalculateCart();
  }
  eliminarDescuento(i: number) {
    this.listadoDeDetalle[i].id_descuento = 0;
    this.listadoDeDetalle[i].descuento = 0;
    this.recalculateCart();
  }
  eliminarDescuentoGlobal() {
    this.id_descuento = 0;
    this.descuento = 0;
    this.recalculateCart();
  }
  // Add Item
  addItem(): void {
    // (this.userForm.get("items") as UntypedFormArray).push(
    //   this.formBuilder.control(null)
    // );
    this.selectedAccount.push("Busque un item");
    this.listadoDeDetalle.push({
      id_catalogo: 0,
      codigo: "",
      nombre: "",
      precio_sin_iva: 0,
      precio_con_iva: 0,
      cantidad: 1,
      subtotal: 0,
      descuento: 0,
      id_descuento: 0,
      iva: 0,
      total: 0,
    });
    this.listadoCatalogosLoading.push(false);
  }

  // Get Item Data
  getItemFormControls(): AbstractControl[] {
    return (<UntypedFormArray>this.userForm.get("items")).controls;
  }

  // Remove Item
  removeItem(index: any) {
    // (this.userForm.get("items") as UntypedFormArray).removeAt(index);
    var array: any[] = this.listadoDeDetalle;
    array[index] = null;
    this.listadoDeDetalle = array.filter((e) => e != null);
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true;
    this.loading = true;
    var monto =
      this.cheque +
      this.tarjeta +
      this.credito +
      this.transferencia +
      (this.efectivo - this.cambio);

    console.log(this.InvoicesForm.valid);
    console.log(this.InvoicesForm.errors);
    console.log(this.InvoicesForm.value);
    if (this.listadoDeDetalle.length == 0) {
      this.toastService.show("La factura debe tener detalle", {
        classname: "bg-danger text-white",
      });
    } else if (this.cambio < 0 || monto < this.montoTotal) {
      this.toastService.show("Favor verifique el metodo de pago y el valor", {
        classname: "bg-danger text-white",
      });
    } else if (
      this.InvoicesForm.valid &&
      this.montoTotal > 0 &&
      this.metodoPago > 0
    ) {
      // var form = {
      //   cliente: this.form["cliente"].value,
      //   direccion: this.form["direccion"].value,
      //   no_registro: this.form["no_registro"].value,
      //   nit: this.form["nit"].value,
      //   giro: this.form["giro"].value,
      //   id_municipio: this.form["id_municipio"].value,
      //   id_tipo_factura: this.form["id_tipo_factura"].value,
      //   subtotal: this.subtotal,
      //   descuento: this.descuento,
      //   iva: this.iva,
      //   total: this.montoTotal,
      //   efectivo: Number(this.efectivo - this.cambio),
      //   tarjeta: Number(this.tarjeta),
      //   cheque: Number(this.cheque),
      //   transferencia: Number(this.transferencia),
      //   credito: Number(this.credito),
      //   id_descuento: this.id_descuento,
      //   id_metodo_pago: this.metodoPago,
      //   detalle_factura: this.listadoDeDetalle,
      // };

      this.InvoicesForm.patchValue({
        subtotal: this.subtotal,
        descuento: this.descuento,
        iva: this.iva,
        total: this.montoTotal,
        efectivo: Number(this.efectivo - this.cambio),
        tarjeta: Number(this.tarjeta),
        cheque: Number(this.cheque),
        transferencia: Number(this.transferencia),
        credito: Number(this.credito),
      });
      var form = this.InvoicesForm.value;
      (form.detalle_factura = this.listadoDeDetalle),
        (form.id_metodo_pago = this.metodoPago),
        this.service.guardar(form).subscribe({
          next: (resp) => {
            this.submitted = false;
            this.loading = false;
            var r: any = resp;
            if (r.status) {
              this.resetartodo();
              this.toastService.show(r.msg, {
                classname: "bg-success text-white",
              });
            } else {
              this.toastService.show(r.msg, {
                classname: "bg-danger text-white",
              });
            }
          },
          error: (resp) => {
            this.loading = false;
            this.toastService.show(
              "Ocurrio un error al cargar la información",
              {
                classname: "bg-danger text-white",
              }
            );
          },
        });
    } else {
      this.toastService.show("Favor verificar los parametros ingresados", {
        classname: "bg-danger text-white",
      });
    }
  }

  resetartodo() {
    this.InvoicesForm.reset();
    this.tipoFactura = 1;
    this.rearmarFormulario(this.tipoFactura);
    this.cargarNoFacturaEvent();
    this.subtotal = 0;
    this.descuento = 0;
    this.iva = 0;
    this.montoTotal = 0;
    this.efectivo = 0;
    this.cambio = 0;
    this.tarjeta = 0;
    this.cheque = 0;
    this.transferencia = 0;
    this.credito = 0;
    this.id_descuento = 0;
    this.metodoPago = 0;
    this.listadoDeDetalle = [];
    this.listadoMunicipios = [];
    this.itemSeleccionado = 0;
    this.selectedAccount = [];
    this.listadoDeCatalogos = [];
    this.listadoClientes = [];
  }

  keyword = "nombre";
  listadoClientes = [];
  selectEvent(item: any) {
    // do something with selected item
    const {
      Municipio = null,
      nombre = "",
      giro = "",
      nit = "",
      registro_nrc = "",
      direccion = "",
      correo = "",
      telefono = "",
      dui = "",
      razon_social = "",
      id_cliente = 0,
      foto_url_nrc = ""
    } = item;
    this.imagen = foto_url_nrc;
    if (this.listadoDepartamentos.length == 0) {
      this.obtenerDEpartamentos();
    }
    if (Municipio.id_departamento > 0) {
      this.listadoMunicipios = [{ ...Municipio }];
    }
    this.InvoicesForm.patchValue({
      cliente: nombre,
      giro,
      nit,
      no_registro: registro_nrc,
      id_municipio: Municipio.id_municipio,
      id_departamento: Municipio.id_departamento,
      direccion,
      correo,
      telefono,
      dui,
      razon_social,
      id_cliente,
    });
  }

  onChangeSearch(val: any) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.InvoicesForm.patchValue({
      cliente: val,
    });
    console.log(1234);
    if (val.length < 3) return;
    this.buscarCliente.next(val);
  }

  onFocused(e: any) {
    // do something when input is focused
    // console.log(e);
  }

  //// crear cliente

  /**
   * Open modal
   * @param content modal content
   */
  imagen: any = null;
  listJsForm!: UntypedFormGroup;
  openModal(content: any) {
    this.imagen = null;
    this.listJsForm.reset();
    this.listJsForm.controls["id_"].setValue(0);
    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
  }

  filess: any = null;
  cargar_files($event: any) {
    this.filess = $event.target.files[0];
  }

  /**
   * Form data get
   */
  get formCliente() {
    return this.listJsForm.controls;
  }

  /**
   * Save saveListJs
   */
  saveListJs() {
    if (this.listJsForm.valid) {
      var formData = new FormData();
      if (this.filess != null) {
        formData.append("files", this.filess, this.filess.name);
      }
      formData.append("nombre", this.formCliente["nombre"].value);
      formData.append("giro", this.formCliente["giro"].value);
      formData.append("razon_social", this.formCliente["razon_social"].value);
      formData.append("registro_nrc", this.formCliente["registro_nrc"].value);
      formData.append("nit", this.formCliente["nit"].value);
      formData.append("id_municipio", this.formCliente["id_municipio"].value);
      formData.append("direccion", this.formCliente["direccion"].value);
      formData.append("telefono", this.formCliente["telefono"].value);
      formData.append("correo", this.formCliente["correo"].value);
      formData.append("dui", this.formCliente["dui"].value);

      this.loading = true;
      this.apiService.create(formData, 0).subscribe((resp: any) => {
        this.loading = false;
        if (resp.status) {
          this.toastService.show(resp.msg, {
            classname: "bg-success text-white",
          });
          this.selectEvent(resp.data);
          this.modalService.dismissAll();

          this.InvoicesForm.patchValue({
            cliente_search: resp.data,
          });
          setTimeout(() => {
            this.listJsForm.reset();
          }, 500);
        } else {
          this.toastService.show(resp.msg, {
            classname: "bg-danger text-white",
          });
        }
      });
    }
    this.submitted = true;
  }
}
