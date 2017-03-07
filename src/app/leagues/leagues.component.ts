import { Component, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'leagues',
  providers: [HttpClient],
  templateUrl: '../templates/leagues.html'
})
export class LeaguesComponent implements OnDestroy {

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

  public ngOnDestroy() {
  }

}
