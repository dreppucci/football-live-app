import { Component, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef,
  ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { AppStore } from '../stores/app';
import { SearchLeagueStore } from '../stores/search-league';
import { Observable }  from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'search-league',
  providers: [ CacheService, {provide: CacheStorageAbstract, useClass:CacheLocalStorage} ],
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
    private cacheService: CacheService
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

    if ( !this.cacheService.exists('leagues') ) {
      this.getData();
    } else {
      this.searchLeagueStore.saveLeaguesList( this.cacheService.get('leagues') );
    }

  }

  public ngOnDestroy () {
    this.cdref.detach();
  }

  private filterLeaguesList() {
    this.searchLeagueStore.updateLeaguesList( this.localState.leagueSearching );
  }

  private getData() {
    this.appStore.leagues.subscribe(
      (data: any) => this.saveLeaguesData( data.json() ),
      (error) => console.log(error)
    );
  }

  private saveLeaguesData(data: Object) {
    this.searchLeagueStore.saveLeaguesList(data);
  }

}
