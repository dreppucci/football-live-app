import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ApplicationRef, ViewChild, ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { SearchLeagueStore } from '../stores/search-league';
import { HttpClient } from '../services/http-client';

import { Observable, Observer, Subject }  from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'search-league',
  providers: [HttpClient],
  templateUrl: '../templates/search-league.html'
})
export class SearchLeagueComponent implements AfterViewInit {

  public localState: Object<any> = { leagueSearching: '' };
  @Input() public filteredLeagues: Object;
  @ViewChild('league') private inputElRef: ElementRef;

  constructor(
    public route: ActivatedRoute,
    public searchLeagueStore: SearchLeagueStore,
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
          this.localState.leagueSearching = keyboardEvent.target.value;
          this.cdref.detectChanges();
          this.getLeaguesList();
        });

      this.searchLeagueStore.filteredLeaguesList
        .subscribe( (data) => {
          this.filteredLeagues = data;
          this.cdref.detectChanges();
        } );
    });

  }

  private getLeaguesList() {
    return this.http.get('competitions')
    .subscribe(
      (data: any) => this.showFilteredLeaguesList(data),
      (error) => console.log(error)
    );
  }

  private showFilteredLeaguesList(leagues: any): Observable {
    let leaguesListJson: Object = leagues.json();

    this.searchLeagueStore.updateLeaguesList(leaguesListJson, this.localState.leagueSearching );
  }

}
