import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'leagues',
  providers: [HttpClient],
  templateUrl: '../templates/leagues.html'
})
export class LeaguesComponent implements AfterViewInit {

  constructor(
    public route: ActivatedRoute,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    this.asyncMockedData();
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/leagueTable.json')
        .then((data) => {
          console.log('async mockData', data);
          // this.teamsStandingStore.showStandings(data);
        });

    });
  }

}
