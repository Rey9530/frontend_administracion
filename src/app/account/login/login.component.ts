import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

// Login Auth
import { environment } from "../../../environments/environment";
import { AuthenticationService } from "../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../core/services/authfake.service";
import { ToastService } from "./toast-service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;

  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private authFackservice: AuthfakeauthenticationService,
    private route: ActivatedRoute,
    public toastService: ToastService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    console.log((localStorage.getItem("currentUser")));
    if (localStorage.getItem("currentUser")) {
      var usuario = localStorage.getItem("currentUser") ?? "{}";
      var jsonUsuario = JSON.parse(usuario); 
      if(jsonUsuario!=null && jsonUsuario.token!=null){
        this.router.navigate(["/admin"]);
      }
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ["usuario@demo.com", [Validators.required, Validators.email]],
      password: ["1234", [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // Login Api
    this.authenticationService
      .login(this.f["email"].value, this.f["password"].value)
      .subscribe(
        (data: any) => {
          if (data.status) {
            localStorage.setItem("toast", "true");
            localStorage.setItem("currentUser", JSON.stringify(data.data));
            localStorage.setItem("token", data.token);
            console.log("Entramoooos");
            this.router.navigate(['/admin/home']);
          } else {
            this.toastService.show(data.msg, {
              classname: "bg-danger text-white",
              delay: 15000,
            });
          }
        },
        (err) => { 
          this.toastService.show("El usuario o clave son incorrectos", {
            classname: "bg-danger text-white",
            delay: 15000,
          });
        }
      ); 
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
