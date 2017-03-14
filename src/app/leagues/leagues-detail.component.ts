import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input, HostBinding, animate, state, style, transition, trigger } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'leagues-detail',
  providers: [HttpClient],
  templateUrl: '../templates/leagues-detail.html',
  styles: [':host { width: 100%; display: block; position: absolute; }'],
  animations: [
    trigger('routeAnimation', [
      state('*', style({transform: 'translateX(0)', opacity: 1})),
      transition('void => *', [
        style({opacity: 0}),
        animate('0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000)')
      ]),
      transition('* => void',
        animate('0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000)', style({opacity: 0}))
      )
    ])
  ]
})
export class LeaguesDetailComponent implements OnInit, OnDestroy {

  public id: string;
  private sub: any;

  constructor(
    public route: ActivatedRoute,
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
