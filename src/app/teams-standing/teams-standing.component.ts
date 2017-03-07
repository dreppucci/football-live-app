import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TeamsStandingStore } from '../stores/teams-standing';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'teams-standing',
  providers: [HttpClient, TeamsStandingStore],
  templateUrl: '../templates/teams-standing.html'
})
export class TeamsStandingComponent implements AfterViewInit {

  @Input() private teams: Object;
  @Input('leagueId') private leagueId: string;
  @Input('fullData') private fullData: string;

  constructor(
    public route: ActivatedRoute,
    private teamsStandingStore: TeamsStandingStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    this.ngzone.runOutsideAngular( () => {

      this.teamsStandingStore.standings
        .subscribe( (data) => {
          this.teams = data;
          this.cdref.detectChanges();
        } );
    });

    this.http.get(`competitions/${this.leagueId}/leagueTable`)
      .subscribe(
        (data: any) => this.teamsStandingStore.showStandings(data.json()),
        (error) => console.log(error)
      );

    // this.asyncMockedData();
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/leagueTable.json')
        .then((data) => {
          console.log('async mockData', data);
          this.teamsStandingStore.showStandings(data);
        });

    });
  }

}
