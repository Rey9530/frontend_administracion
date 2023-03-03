import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/account/login/toast-service"; 
import { BloquesServicesService } from 'src/app/core/services';
// Sweet Alert
import Swal from "sweetalert2";


@Component({
  selector: 'app-bloques',
  templateUrl: './bloques.component.html',
  styles: [
  ]
})
export class BloquesComponent {
  todoForm!: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  listado: any = [];

  listadoTipos: any = []; 
  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private service: BloquesServicesService, 
    public toastService: ToastService
  ) {} 
  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      tira: ["", [Validators.required]],
      desde: ["", [Validators.required]], 
      hasta: ["", [Validators.required]],
      actual: ["", [Validators.required]],
      serie: ["", [Validators.required]], 
      id_tipo_factura: ["", [Validators.required]], 
      id_: [0],
    }); 
    this.obtenerListado();
    this.obtenerListadoDeTipos();
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
    var data = this.listado.filter((e: any) => e.id_bloque == id_);
    this.todoForm.patchValue({
      tira: data[0].tira,
      desde: data[0].desde,
      hasta: data[0].hasta,
      actual: data[0].actual,
      serie: data[0].serie,
      id_tipo_factura: data[0].id_tipo_factura, 
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

  obtenerListadoDeTipos() {
    this.loading = true;
    this.service.getTiposFactural().subscribe({
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
 
  saveTodo() { 
    console.log(this.todoForm.valid);
    if (this.todoForm.valid) {
      var data = { 
        tira: this.form["tira"].value,
        desde: this.form["desde"].value, 
        hasta: this.form["hasta"].value, 
        actual: this.form["actual"].value, 
        serie: this.form["serie"].value, 
        id_tipo_factura: Number(this.form["id_tipo_factura"].value), 
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

  saverange(){
    console.log("data");
  }
  eliminar(id_: number) {
    var data = this.listado.filter((e: any) => e.id_bloque == id_);

    Swal.fire({
      title: "¿Está seguro?",
      text: "Estas por eliminar: " + data[0].tira,
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
