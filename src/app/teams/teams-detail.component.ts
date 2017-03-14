import { Component, OnInit, OnDestroy, NgZone,
  ChangeDetectorRef, ElementRef, Input, HostBinding } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '../services/http-client';
import { TabsComponent, TabComponent } from './../tabs/';
import { RouteAnimation } from '../animations';

@Component({
  selector: 'teams-detail',
  providers: [HttpClient],
  templateUrl: '../templates/teams-detail.html',
  animations: [RouteAnimation]
})
export class TeamsDetailComponent implements OnInit, OnDestroy {

  public id: string;
  private sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  @HostBinding('@routeAnimation')

  public ngOnInit () {
    this.sub = this.route.params.subscribe( (params: any) => {
      this.id = params.id;
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
