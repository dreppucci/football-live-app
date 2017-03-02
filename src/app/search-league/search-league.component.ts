import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ApplicationRef, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';
import { HttpClient } from '../shared/http-client';

import { Observable }  from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'search-league',
  providers: [HttpClient],
  templateUrl: '../templates/search-league.html'
})
export class SearchLeagueComponent implements AfterViewInit {

  public localState = { league: '', leaguesListJson: null, leaguesList: [] };
  @ViewChild('league') public inputElRef: ElementRef;

  constructor(
    public route: ActivatedRoute,
    public appState: AppState,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private appref: ApplicationRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    this.ngzone.runOutsideAngular( () => {
      Observable.fromEvent(this.inputElRef.nativeElement, 'keyup')
        .debounceTime(1000)
        .subscribe( (keyboardEvent: any) => {
          this.localState.league = keyboardEvent.target.value;
          this.cdref.detectChanges();
          this.getLeaguesList();
        });
    });
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.league = '';
  }

  private getLeaguesList() {
    return this.http.get(`http://api.football-data.org/v1/competitions`)
    .subscribe(
      (data: any) => this.showFilteredLeaguesList(data),
      (error) => console.log(error)
    );
  }

  private showFilteredLeaguesList(leagues: any) {
    this.localState.leaguesListJson = leagues.json();

    this.localState.leaguesList = this.localState.leaguesListJson
      .filter( (obj) =>
        obj.caption.toLowerCase().indexOf( this.localState.league.toLowerCase() ) !== -1 );

    //this.appState.set('leaguesList', this.localState.leaguesList);
  }

}
