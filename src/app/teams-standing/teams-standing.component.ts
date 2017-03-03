import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef,
  ApplicationRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TeamsStandingStore } from '../stores/teams-standing';
import { HttpClient } from '../services/http-client';

import { Observable, Observer, Subject }  from 'rxjs/Rx';

@Component({
  selector: 'teams-standing',
  providers: [HttpClient],
  templateUrl: '../templates/teams-standing.html'
})
export class TeamsStandingComponent implements OnInit, AfterViewInit {

  @Input() private teams: Object;
  @Input() private leagueId: string;
  private teamsStandingStore: TeamsStandingStore;

  constructor(
    public route: ActivatedRoute,
    private TeamsStandingStore: TeamsStandingStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private appref: ApplicationRef,
    private http: HttpClient
  ) {
    console.clear();
    this.teamsStandingStore = TeamsStandingStore;
  }

  public ngOnInit () {
    // do stuff
  }

  public ngAfterViewInit () {
    this.ngzone.runOutsideAngular( () => {

      this.teamsStandingStore.standings
        .subscribe( (data) => {
          this.teams = data;
          this.cdref.detectChanges();
          console.log(this);
        } );
    });

    this.http.get(`competitions/` + this.leagueId + `/leagueTable`)
      .subscribe(
        (data: any) => this.teamsStandingStore.showStandings(data.json()),
        (error) => console.log(error)
      );
  }

}
