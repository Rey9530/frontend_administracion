import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FacturaServicesService {
  endpoint: String = environment.API_URL + "facturacion/factura";
  constructor(private http: HttpClient) {}
  
  guardar(data:any) {
    return this.http.post(`${this.endpoint}`,data);
  } 
  getData() {
    return this.http.get(`${this.endpoint}`);
  } 
  getDataBloque(id:any) {
    return this.http.get(`${this.endpoint}/obtener/${id}`);
  } 

  actualizar(data:any,id:number) {
    return this.http.put(`${this.endpoint}/${id}`, data);
  } 
  buscarEnCatalago(data:any) {
    return this.http.post(`${this.endpoint}/buscar/catalogo`, data);
  } 
  obtenerMetodosDePago() {
    return this.http.get(`${this.endpoint}/obtener_metodos_pago`);
  } 
  obtenerDepartamentos() {
    return this.http.get(`${this.endpoint}/obtener_departamentos`);
  } 
  obtenerMunicipios(id:any) {
    return this.http.get(`${this.endpoint}/obtener_municipios/${id}`);
  } 

  
  getInvoiceData(desde:any, hasta: any) {
    return this.http.get(`${this.endpoint}/obtener_listado_facturas?desde=${desde}&hasta=${hasta}`);
  } 

  getInvoice(id:any) {
    return this.http.get(`${this.endpoint}/obtener_factura/${id}`);
  } 

  deleteInvoice(id:any) {
    return this.http.delete(`${this.endpoint}/anular_factura/${id}`);
  } 
}
