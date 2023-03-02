import { Component } from '@angular/core';

@Component({
  selector: 'app-e404',
  templateUrl: './e404.component.html',
  styles: [
  ]
})
export class E404Component {

  // set the current year
  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
  }
}
