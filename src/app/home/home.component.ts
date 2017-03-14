import { Component, OnInit, HostBinding } from '@angular/core';
import { RouteAnimation } from '../animations';

@Component({
  selector: 'home',
  templateUrl: '../templates/home.html',
  animations: [RouteAnimation]
})
export class HomeComponent implements OnInit {

  constructor() {
    console.clear();
  }

  @HostBinding('@routeAnimation')

  public ngOnInit() {
    console.clear();
  }
}
