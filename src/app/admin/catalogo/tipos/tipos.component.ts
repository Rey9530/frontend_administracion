import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/account/login/toast-service";
import { TipoCatalogoServicesService } from "src/app/core/services";
// Sweet Alert
import Swal from "sweetalert2";

@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.component.html',
  styles: [
  ]
})
export class TiposComponent {
  todoForm!: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  listado: any = [];
  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private service: TipoCatalogoServicesService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      nombre: ["", [Validators.required]],
      id_: [0],
    });
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
    var data = this.listado.filter((e: any) => e.id_tipo == id_);
    this.todoForm.patchValue({
      nombre: data[0].nombre,
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
            delay: 15000,
          });
        }
      },
      error: (resp) => {
        this.loading = false;
        this.toastService.show("Ocurrio un error al cargar la información", {
          classname: "bg-danger text-white",
          delay: 15000,
        });
      },
    });
  }
  saveTodo() {
    if (this.todoForm.valid) {
      var data = { nombre: this.form["nombre"].value };
      this.service.create(data, this.form["id_"].value).subscribe({
        next: (resp) => {
          var r: any = resp;
          if (r.status) {
            if (this.form["id_"].value > 0) {
              this.obtenerListado();
            } else {
              this.listado.push(r.data);
            }
            this.closeModal();
            this.toastService.show(r.msg, {
              classname: "bg-success text-white",
              delay: 15000,
            });
            this.todoForm.reset();
          }
        },
      });
    }
    this.submitted = true;
  }

  eliminar(id_: number) {
    var data = this.listado.filter((e: any) => e.id_tipo == id_);

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
                delay: 15000,
              });
            }
          },
        });
      }
    });
  }
}
