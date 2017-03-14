import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input, HostBinding } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppStore } from '../stores/app';
import { HttpClient } from '../services/http-client';
import { RouteAnimation } from '../animations';

@Component({
  selector: 'leagues',
  providers: [HttpClient],
  templateUrl: '../templates/leagues.html',
  animations: [RouteAnimation]
})
export class LeaguesComponent implements OnInit, OnDestroy {

  @Input() public leagues: any[] = [];

  constructor(
    public route: ActivatedRoute,
    public appStore: AppStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  @HostBinding('@routeAnimation')

  public ngOnInit() {
    this.getLeaguesData();
  }

  public ngOnDestroy () {
    this.cdref.detach();
  }

  private getLeaguesData() {
    if ( this.appStore.get('leagues') === undefined ) {
      this.getData();
      // this.asyncMockedData();

    } else {
      this.saveLeaguesData( this.appStore.get('leagues') );
    }
  }

  private getData() {
    this.http.get('competitions')
      .subscribe(
        (data: any) => this.saveLeaguesData(data.json()),
        (error) => console.log(error)
    );
  }

  private saveLeaguesData(data: Object) {
    this.appStore.set('leagues', data);
    this.leagues = this.appStore.get('leagues');
  }

  private asyncMockedData() {

    setTimeout(() => {
      System.import('../../assets/mock-data/competitions.json')
        .then((data) => {
          this.saveLeaguesData( data );
        });

    });
  }

}
