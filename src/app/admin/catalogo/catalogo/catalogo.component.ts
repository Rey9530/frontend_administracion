import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/account/login/toast-service"; 
import { CatalogoServicesService, CategoriasCatalogoServicesService, TipoCatalogoServicesService } from 'src/app/core/services';
// Sweet Alert
import Swal from "sweetalert2";


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styles: [
  ]
})
export class CatalogoComponent {
  todoForm!: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  listado: any = [];

  listadoCate: any = [];
  listadoTipo: any = [];
  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private service: CatalogoServicesService,
    private serviceCat: CategoriasCatalogoServicesService,
    private serviceTipo: TipoCatalogoServicesService,
    public toastService: ToastService
  ) {} 
  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      nombre: ["", [Validators.required]],
      codigo: ["", [Validators.required]], 
      id_categoria: ["", [Validators.required]],
      id_tipo: ["", [Validators.required]],
      descripcion: [""],
      precio: [0, [Validators.required]],
      id_: [0],
    });
    this.obtenerListadoCatTipo();
    this.obtenerListado();
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: "md" });
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  get form() {
    return this.todoForm.controls;
  }

  editarRegistro(content: any, id_: any) {
    var data = this.listado.filter((e: any) => e.id_catalogo == id_);
    this.todoForm.patchValue({
      nombre: data[0].nombre,
      codigo: data[0].codigo,
      id_categoria: data[0].id_categoria,
      id_tipo: data[0].id_tipo,
      descripcion: data[0].descripcion,
      precio: data[0].precio,
      id_,
    });
    this.openModal(content);
  }

  obtenerListado() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.listado = r.registros;
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

  obtenerListadoCatTipo() {
    this.loading = true;
    this.serviceCat.getAll().subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.listadoCate = r.registros;
        } else {
          this.toastService.show("Ocurrio un error al cargar la información", {
            classname: "bg-danger text-white",
            
          });
        }
      },
      error: (resp) => {
        this.loading = false; 
      },
    });

    this.serviceTipo.getAll().subscribe({
      next: (resp) => {
        this.loading = false;
        var r: any = resp;
        if (r.status) {
          this.listadoTipo = r.registros;
        } else {
          this.toastService.show("Ocurrio un error al cargar la información", {
            classname: "bg-danger text-white",
            
          });
        }
      },
      error: (resp) => {
        this.loading = false; 
      },
    });
  }
  saveTodo() { 
    if (this.todoForm.valid) {
      var data = { 
        nombre: this.form["nombre"].value,
        codigo: this.form["codigo"].value,
        id_categoria: Number(this.form["id_categoria"].value),
        id_tipo: Number(this.form["id_tipo"].value),
        descripcion: this.form["descripcion"].value,
        precio: this.form["precio"].value,
     };
      this.service.create(data, this.form["id_"].value).subscribe({
        next: (resp) => {
          var r: any = resp;
          if (r.status) {
            this.obtenerListado();
            this.closeModal();
            this.toastService.show(r.msg, {
              classname: "bg-success text-white",
              
            });
            this.todoForm.reset();
          }
        },
      });
    }
    this.submitted = true;
  }

  eliminar(id_: number) {
    var data = this.listado.filter((e: any) => e.id_catalogo == id_);

    Swal.fire({
      title: "¿Está seguro?",
      text: "Estas por eliminar: " + data[0].nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#364574",
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "No, Cancelar!",
    }).then((result) => {
      if (result.value) {
        this.service.delete(id_).subscribe({
          next: (resp) => {
            var r: any = resp;
            if (r.status) {
              this.obtenerListado();

              this.toastService.show(r.msg, {
                classname: "bg-success text-white",
                
              });
            }
          },
        });
      }
    });
  }
}