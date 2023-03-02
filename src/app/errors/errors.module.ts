import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { E404Component } from './e404/e404.component';
import { ErrorsRoutingModule } from './errors-routing.module';



@NgModule({
  declarations: [
    E404Component
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule { }
