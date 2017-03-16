import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'teams-standing',
  providers: [HttpClient, TeamsStore],
  templateUrl: '../templates/teams-standing.html'
})
export class TeamsStandingComponent implements AfterViewInit {

  @Input() private teams: Object;
  @Input('leagueId') private leagueId: string;
  @Input('fullData') private fullData: string;
  private imgFallback = require('../../assets/gfx/lgo.svg');

  constructor(
    public route: ActivatedRoute,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    this.ngzone.runOutsideAngular( () => {

      this.teamsStore.standings
        .subscribe( (data) => {
          this.teams = data;
          this.cdref.detectChanges();
        } );
    });

    this.http.get(`competitions/${this.leagueId}/leagueTable`)
      .subscribe(
        (data: any) => this.teamsStore.showStandings(data.json()),
        (error) => console.log(error)
      );

    // this.asyncMockedData();
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/leagueTable.json')
        .then((data) => {
          this.teamsStore.showStandings(data);
        });

    });
  }

}
