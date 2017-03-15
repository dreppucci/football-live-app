import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteAnimation } from '../animations';

@Component({
  selector: 'about',
  templateUrl: '../templates/about.html',
  animations: [RouteAnimation]
})
export class AboutComponent implements OnInit {
  
  constructor() {
    console.clear();
  }

  @HostBinding('@routeAnimation')

  public ngOnInit() {
    console.clear();
  }

}
