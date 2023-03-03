import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class BloquesServicesService {
  endpoint: String = environment.API_URL + "facturacion/bloques";
  constructor(private http: HttpClient) {}
  getAll() {
    return this.http.get(`${this.endpoint}`);
  }
  getTiposFactural() {
    return this.http.get(`${this.endpoint}/factura/tipos`);
  }
  getOne(id: any) {
    return this.http.get(`${this.endpoint}/${id}`);
  }

  create(data:any,id:number) {
    if(id>0){
      return this.http.put(`${this.endpoint}/${id}`, data);
    }else{ 
      return this.http.post(`${this.endpoint}`, data); 
    }
  } 
  delete(id: any) {
    return this.http.delete(`${this.endpoint}/${id}`);
  }

}
