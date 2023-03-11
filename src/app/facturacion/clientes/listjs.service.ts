/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from "@angular/core";

import { BehaviorSubject, Observable, of, Subject } from "rxjs";

// export type ListJsModel = keyof any;
// import {ListJsModel} from './listjs.model';
// import {ListJs} from './data';
import { DecimalPipe } from "@angular/common";
import { debounceTime, delay, switchMap, takeUntil, tap } from "rxjs/operators";
import { SortColumn, SortDirection } from "./listjs-sortable.directive";
import { ClienteServicesService } from "src/app/core/services";

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

// function matches(country: any, term: string, pipe: PipeTransform) {
//   return (
//     country.customer_name.toLowerCase().includes(term.toLowerCase()) ||
//     country.email.toLowerCase().includes(term.toLowerCase()) ||
//     country.phone.toLowerCase().includes(term.toLowerCase()) ||
//     country.date.toLowerCase().includes(term.toLowerCase()) ||
//     country.status.toLowerCase().includes(term.toLowerCase())
//   );
// }

@Injectable({ providedIn: "root" })
export class OrdersService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  listadoClientes: any[] = [];
  isLoading = false;

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: "",
    sortColumn: "",
    sortDirection: "",
    startIndex: 1,
    endIndex: 10,
    totalRecords: 0,
  };

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  buscarCliente = new Subject<void>();
  debouncedCliente = this.buscarCliente.pipe(
    debounceTime(1000), 
    switchMap(() => {
      this.isLoading = true;
      return this.apiService.getAll(this.page, this.pageSize, this.searchTerm);
    })
  );

  constructor(
    private pipe: DecimalPipe,
    private apiService: ClienteServicesService
  ) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false)),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((result) => {
        this._countries$.next(result.countries);
        this._total$.next(result.total);
      });

    this._search$.next();

    this.debouncedCliente.subscribe((data: any) => {
      this.ordernaData(data);
    });

    this.buscarCliente.next();
  }

  loadRegistros() {
    this.isLoading = true;
    this.apiService
      .getAll(this.page, this.pageSize, this.searchTerm)
      .subscribe((data: any) => {
        this.ordernaData(data);
      });
  }
  ordernaData(data: any) {
    if (data.status) {
      this.listadoClientes = data.data;
      this.totalRecords = data.total;
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
  get countries$() {
    return this._countries$.asObservable();
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

  set page(page: number) {
    this._set({ page });
    this.loadRegistros();
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._state.page = 1;
    this._set({ searchTerm });
    this.buscarCliente.next();
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

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let countries = sort(this.listadoClientes, sortColumn, sortDirection);

    // 2. filter
    // countries = countries.filter((country) =>
    //   matches(country, searchTerm, this.pipe)
    // );
    const total = countries.length;

    // 3. paginate
    // this.totalRecords = countries.length;
    // this._state.startIndex = (page - 1) * this.pageSize + 1;
    // this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    // if (this.endIndex > this.totalRecords) {
    //   this.endIndex = this.totalRecords;
    // }
    // countries = countries.slice(
    //   this._state.startIndex - 1,
    //   this._state.endIndex
    // );
    return of({ countries, total });
  }
}
