import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ElementRef, Input, Output } from '@angular/core';

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

  public playersGroup: Object = [];
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
        this.groupData(data);
      } );
  }

  private getData() {
    this.http.get(`teams/${this.teamId}/players`)
      .subscribe(
        (data: any) => this.teamsStore.showPlayers(data.json()),
        (error) => console.log(error)
      );
  }

  private groupData(data) {
    data.players
      .map( (player) => {
        let positionName = player.position;

        if (!this.playersGroup[positionName]) {
          this.playersGroup[positionName] = [];
          this.playersGroup[positionName].name = positionName;
          this.playersGroup[positionName].push( player );
        } else {
          this.playersGroup[positionName].push( player );
        }
      } );
    this.data = this.playersGroup;
    this.cdref.detectChanges();
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/players.json')
        .then((data) => {
          this.teamsStore.showPlayers(data);
        });

    });
  }

}
