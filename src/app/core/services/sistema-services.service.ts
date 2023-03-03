import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SistemaServicesService {
  endpoint: String = environment.API_URL + "facturacion/sistema_data";
  constructor(private http: HttpClient) {}
  getData() {
    return this.http.get(`${this.endpoint}`);
  } 

  actualizar(data:any,id:number) {
    return this.http.put(`${this.endpoint}/${id}`, data);
  } 
}
