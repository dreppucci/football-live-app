import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ViewChild, ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
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
export class SearchLeagueComponent implements AfterViewInit {

  public localState: Object<any> = { leagueSearching: '' };
  @Input() public filteredLeagues: Object;
  @ViewChild('league') private inputElRef: ElementRef;

  constructor(
    public route: ActivatedRoute,
    public searchLeagueStore: SearchLeagueStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
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
          this.filterLeaguesList();
        });

      this.searchLeagueStore.filteredLeaguesList
        .subscribe( (data) => {
          this.filteredLeagues = data;
          this.cdref.detectChanges();
        } );
    });

    this.http.get('competitions')
      .subscribe(
        (data: any) => this.searchLeagueStore.saveLeaguesList(data.json()),
        (error) => console.log(error)
      );

  }

  private filterLeaguesList() {
    this.searchLeagueStore.updateLeaguesList( this.localState.leagueSearching );
  }

}
