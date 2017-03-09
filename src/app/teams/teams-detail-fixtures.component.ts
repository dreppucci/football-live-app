import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'teams-detail-fixtures',
  providers: [HttpClient, TeamsStore],
  templateUrl: '../templates/teams-detail-fixtures.html'
})
export class TeamsDetailFixturesComponent implements OnInit, OnDestroy {

  public id: string;
  private sub: any;

  constructor(
    public route: ActivatedRoute,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngOnInit () {
    this.sub = this.route.params.subscribe( (params: any) => {
      this.id = params.id;

      /*this.http.get(`teams/${this.id}/fixtures`)
        .subscribe(
          (data: any) => this.teamsStore.showStandings(data.json()),
          (error) => console.log(error)
        );*/

      this.asyncMockedData();
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/fixtures.json')
        .then((data) => {
          this.teamsStore.showFixtures(data);
        });

    });
  }

}
