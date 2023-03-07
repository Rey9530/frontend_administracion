import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/account/login/toast-service';
import { BloquesServicesService, SistemaServicesService } from 'src/app/core/services';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styles: [
  ]
})
export class ConfigComponent {
  todoForm!: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false; 

  listadoTipos: any = []; 
  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: SistemaServicesService, 
    public toastService: ToastService
  ) {} 
  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      nombre_sistema: ["", [Validators.required]],
      impuesto: ["", [Validators.required]], 
      direccion: [""], 
      razon: [""], 
      nit: [""], 
      nrc: [""], 
      contactos: [""], 
      id_: [0],
    }); 
    this.obtenerListado(); 
  }
  

  obtenerListado() {
    this.loading = true;
    this.service.getData().subscribe({
      next: (resp) => {
        this.loading = false;
        var data: any = resp;  
        this.todoForm.patchValue({
          nombre_sistema: data.data.nombre_sistema,
          impuesto: data.data.impuesto ,
          direccion:data.data.direccion,
          razon:data.data.razon,
          nit:data.data.nit,
          nrc:data.data.nrc,
          contactos:data.data.contactos,
          id_: data.data.id_general , 
        }); 
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
    if (this.todoForm.valid) {
      var data = { 
        nombre_sistema: this.form["nombre_sistema"].value,
        direccion:this.form["direccion"].value,
        razon:this.form["razon"].value,
        nit:this.form["nit"].value,
        nrc:this.form["nrc"].value,
        contactos:this.form["contactos"].value,
        impuesto: this.form["impuesto"].value,  
     };
      this.service.actualizar(data, this.form["id_"].value).subscribe({
        next: (resp) => {
          var r: any = resp; 
          if (r.status) { 
            this.toastService.show(r.msg, {
              classname: "bg-success text-white", 
            }); 
          }
        },
      });
    }
    this.submitted = true;
  }
  get form() {
    return this.todoForm.controls;
  }

}
