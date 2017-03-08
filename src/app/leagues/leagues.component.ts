import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppStore } from '../stores/app';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'leagues',
  providers: [HttpClient],
  templateUrl: '../templates/leagues.html'
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

  public ngOnInit() {
    this.getLeaguesData();
  }

  public ngOnDestroy () {
    this.cdref.detach();
  }

  private getLeaguesData() {
    if ( this.appStore.get('leagues') === undefined ) {
      /*this.http.get('competitions')
        .subscribe(
          (data: any) => this.saveLeaguesData(data.json()),
          (error) => console.log(error)
      );*/

      this.asyncMockedData();

    } else {
      this.saveLeaguesData( this.appStore.get('leagues') );
    }
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
