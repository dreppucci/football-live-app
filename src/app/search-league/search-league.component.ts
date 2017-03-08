import { Component, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef,
  ViewChild, ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppStore } from '../stores/app';
import { SearchLeagueStore } from '../stores/search-league';
import { HttpClient } from '../services/http-client';
import { Observable }  from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'search-league',
  providers: [HttpClient],
  templateUrl: '../templates/search-league.html'
})
export class SearchLeagueComponent implements AfterViewInit, OnDestroy {

  public localState: any = { leagueSearching: '' };
  @Input() public filteredLeagues: Object;
  @ViewChild('league') private inputElRef: ElementRef;

  constructor(
    public route: ActivatedRoute,
    public appStore: AppStore,
    public searchLeagueStore: SearchLeagueStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    Observable.fromEvent(this.inputElRef.nativeElement, 'keyup')
      .debounceTime(1000)
      .subscribe( (keyboardEvent: any) => {
        this.localState.leagueSearching = keyboardEvent.target.value;
        this.cdref.detectChanges();
        this.filterLeaguesList();
      });

    this.searchLeagueStore.filteredLeaguesList
      .subscribe( (data) => {
        this.filteredLeagues = data;
        this.cdref.detectChanges();
      } );

    this.getLeaguesData();

  }

  public ngOnDestroy () {
    this.cdref.detach();
  }

  private filterLeaguesList() {
    this.searchLeagueStore.updateLeaguesList( this.localState.leagueSearching );
  }

  private getLeaguesData() {
    if ( this.appStore.get( 'leagues' ) === undefined ) {
      this.http.get( 'competitions' )
        .subscribe(
          (data: any) => this.saveLeaguesData(data.json()),
          (error) => console.log(error)
      );

      // this.asyncMockedData();

    } else {
      this.saveLeaguesData( this.appStore.get('leagues') );
    }
  }

  private saveLeaguesData(data: Object) {
    this.searchLeagueStore.saveLeaguesList(data);
    this.appStore.set('leagues', data);
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
