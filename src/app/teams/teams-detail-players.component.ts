import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';
import { OrderBy } from '../services/orderBy';

@Component({
  selector: 'teams-detail-players',
  providers: [HttpClient, TeamsStore],
  templateUrl: '../templates/teams-detail-players.html'
})
export class TeamsDetailPlayersComponent implements AfterViewInit {

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
    this.teamsStore.teamPlayers
      .subscribe( (data) => {
        this.data = data;
        this.cdref.detectChanges();
      } );
  }

  private getData() {
    this.http.get(`teams/${this.teamId}/players`)
      .subscribe(
        (data: any) => this.teamsStore.showPlayers(data.json()),
        (error) => console.log(error)
      );
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/players.json')
        .then((data) => {
          this.teamsStore.showPlayers(data);
        });

    });
  }

  private unsubscribeToStoreProperty() {
    this.teamsStore.teamPlayers
      .unsubscribe();
  }

}
