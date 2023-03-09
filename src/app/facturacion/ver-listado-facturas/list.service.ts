/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from "@angular/core";

import { BehaviorSubject, Observable, of, Subject, Subscription } from "rxjs";

import { DecimalPipe } from "@angular/common";
import { debounceTime, delay, switchMap, tap } from "rxjs/operators";
import { SortColumn, SortDirection } from "./list-sortable.directive";

// Date Format
import { DatePipe } from "@angular/common";
import { FacturaServicesService } from "src/app/core/services";

interface SearchResult {
  countries: any[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  date: any;
  status: string;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(countries: any[], column: SortColumn, direction: string): any[] {
  if (direction === "" || column === "") {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === "asc" ? res : -res;
    });
  }
}

function matches(country: any, term: string, pipe: PipeTransform) {
  return (
    country.cliente.toLowerCase().includes(term.toLowerCase()) ||
    country.numero_factura.toLowerCase().includes(term.toLowerCase())
  );
}

@Injectable({ providedIn: "root" })
export class ListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  leads?: any;

  total_facturado =0 ;
  total_facturas =0 ;
  porcentaje_consumidor_final =0 ;
  total_consumidor_final =0 ;
  total_facturas_consumidor_final =0 ;
  porcentaje_credito_fiscal =0 ;
  total_credito_fiscal =0 ;
  total_facturas_credito_fiscal =0 ;
  porcentaje_anuladas =0 ;
  total_anuladas =0 ;
  total_facturas_anuladas =0 ;

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: "",
    sortColumn: "",
    sortDirection: "",
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
    date: "",
    status: "0",
  };

  ngOnDestroy() {
    this._search$.unsubscribe();
    this._countries$.unsubscribe();
    this._total$.unsubscribe();
    this._loading$.unsubscribe();
    this.subscription1$.unsubscribe();
  }

  subscription1$: Subscription = new Subscription();
  constructor(
    private pipe: DecimalPipe,
    public restApiService: FacturaServicesService,
    private datePipe: DatePipe
  ) {
    this._state.date = { from: new Date(), to: new Date() };
    this.subscription1$ = this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._countries$.next(result.countries);
        this._total$.next(result.total);
      });

    this._search$.next();
    // Api Data
    this.loadFacturas();
  }
  loadFacturas() {
    var desde = this.convert(this.date.from);
    var hasta = this.convert(this.date.to);
    this.restApiService.getInvoiceData(desde, hasta).subscribe((data: any) => {  
      this.leads = data.data;
      

      this.total_facturado = data.contadores.total_facturado;
      this.total_facturas = data.contadores.total_facturas;
      this.total_consumidor_final = data.contadores.total_consumidor_final;
      this.total_facturas_consumidor_final = data.contadores.total_facturas_consumidor_final;
      this.total_credito_fiscal = data.contadores.total_credito_fiscal;
      this.total_facturas_credito_fiscal = data.contadores.total_facturas_credito_fiscal;
      this.total_anuladas = data.contadores.total_anuladas;
      this.total_facturas_anuladas = data.contadores.total_facturas_anuladas;

      if(this.total_consumidor_final>0){
        this.porcentaje_consumidor_final =  (this.total_consumidor_final*100) / this.total_facturado ;
        this.porcentaje_consumidor_final = Number(this.porcentaje_consumidor_final.toFixed(2)); 
      }

      
      if(this.total_credito_fiscal>0){
        this.porcentaje_credito_fiscal =  (this.total_credito_fiscal*100) / this.total_facturado ;
        this.porcentaje_credito_fiscal = Number(this.porcentaje_credito_fiscal.toFixed(2)); 
      }

      
      if(this.total_anuladas>0){
        this.porcentaje_anuladas =  (this.total_anuladas*100) / this.total_facturado ;
        this.porcentaje_anuladas = Number(this.porcentaje_anuladas.toFixed(2)); 
      } 
    });
  }

  convert(str: string) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  get countries$() {
    return this._countries$.asObservable();
  }
  get datas() {
    return this.leads;
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }
  get startIndex() {
    return this._state.startIndex;
  }
  get endIndex() {
    return this._state.endIndex;
  }
  get totalRecords() {
    return this._state.totalRecords;
  }
  get date() {
    return this._state.date;
  }
  get status() {
    return this._state.status;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }
  set startIndex(startIndex: number) {
    this._set({ startIndex });
  }
  set endIndex(endIndex: number) {
    this._set({ endIndex });
  }
  set totalRecords(totalRecords: number) {
    this._set({ totalRecords });
  }
  set date(date: any) { 
    this._set({date});
  }
  set status(status: any) {
    this._set({ status });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const datas = this.datas ?? [];
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
      date,
      status,
    } = this._state;

    // 1. sort
    let countries = sort(datas, sortColumn, sortDirection);

    countries = countries.filter((country) =>
      matches(country, searchTerm, this.pipe)
    );

    // 4. Date Filter
    // console.log(date);
    // if(date){
    //   countries = countries.filter(country => new Date(country.date) >= new Date(Object.values(date)[0]) && new Date(country.date) <= new Date(Object.values(date)[1]));
    // }
    // else{
    //   countries = countries;
    // }

    // 5. Status Filter
    if (status != "0") {
      countries = countries.filter((country) => country.estado == status);
    } else {
      countries = countries;
    }

    const total = countries.length;

    // 3. paginate
    this.totalRecords = countries.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    countries = countries.slice(
      this._state.startIndex - 1,
      this._state.endIndex
    );
    return of({ countries, total });
  }
}
