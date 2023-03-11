import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CatalogoServicesService {
  endpoint: String = environment.API_URL + "facturacion/catalogo";
  constructor(private http: HttpClient) {}
  getAll(
    pagina: number = 1,
    registrosXpagina: number = 10,
    query: string = ""
  ) {
    return this.http.get(
      `${this.endpoint}?pagina=${pagina}&registrosXpagina=${registrosXpagina}&query=${query}`
    );
  }
  getOne(id: any) {
    return this.http.get(`${this.endpoint}/${id}`); 
  }

  create(data: any, id: number) {
    if (id > 0) {
      return this.http.put(`${this.endpoint}/${id}`, data);
    } else {
      return this.http.post(`${this.endpoint}`, data);
    }
  }
  delete(id: any) {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}
