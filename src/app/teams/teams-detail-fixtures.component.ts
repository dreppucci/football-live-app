import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'teams-detail-fixtures',
  providers: [HttpClient, TeamsStore],
  templateUrl: '../templates/teams-detail-fixtures.html'
})
export class TeamsDetailFixturesComponent implements AfterViewInit {

  @Input() public data: Object;
  @Input('teamId') private teamId: string;

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
    this.subscribeToStoreProperty();

    // this.getData();
    this.asyncMockedData();
  }

  private subscribeToStoreProperty() {
    this.teamsStore.teamFixtures
      .subscribe( (data) => {
        this.data = data;
        this.cdref.detectChanges();
      } );
  }

  private getData() {
    this.http.get(`teams/${this.teamId}/fixtures`)
      .subscribe(
        (data: any) => this.teamsStore.showFixtures(data.json()),
        (error) => console.log(error)
      );
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/fixtures.json')
        .then((data) => {
          this.teamsStore.showFixtures(data);
        });

    });
  }

  private unsubscribeToStoreProperty() {
    this.teamsStore.teamFixtures
      .unsubscribe();
  }

}
