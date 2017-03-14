import { Component, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input, HostBinding } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';
import { OrderBy } from '../services/orderBy';
import { TabAnimation } from '../animations';

@Component({
  selector: 'teams-detail-players',
  providers: [HttpClient, TeamsStore],
  templateUrl: '../templates/teams-detail-players.html',
  animations: [TabAnimation]
})
export class TeamsDetailPlayersComponent implements AfterViewInit, OnDestroy {

  public playersGroup: Object = [];
  @Input() public data: Object;
  @Input('teamId') private teamId: number;
  private sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  @HostBinding('@tabAnimation')

  public ngAfterViewInit () {
    this.sub = this.router.routerState.parent(this.route)
      .params.subscribe( (params) => {
        this.teamId = +params['id'];

        this.getData();
        // this.asyncMockedData();
      });

    this.subscribeToStoreProperty();
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
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
    this.data.count = data.count;
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
