import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'leagues-detail',
  providers: [HttpClient],
  templateUrl: '../templates/leagues-detail.html'
})
export class LeaguesDetailComponent implements OnInit, OnDestroy {

  private id: string;
  private sub: any;

  constructor(
    public route: ActivatedRoute,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngOnInit () {
    this.sub = this.route.params.subscribe( (params) => {
      this.id = params.id;
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
