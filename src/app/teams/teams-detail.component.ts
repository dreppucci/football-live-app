import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'teams-detail',
  providers: [HttpClient],
  templateUrl: '../templates/teams-detail.html'
})
export class TeamsDetailComponent implements OnInit, OnDestroy {

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

  public ngOnInit () {
    this.sub = this.route.params.subscribe( (params: any) => {
      this.id = params.id;
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
