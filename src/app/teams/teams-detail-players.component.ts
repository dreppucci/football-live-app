import { Component, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { TeamsStore } from '../stores/teams';
import { ApiService } from '../services';
import { OrderBy } from '../services/orderBy';
import { TabAnimation } from '../animations';

@Component({
  selector: 'teams-detail-players',
  providers: [ApiService, TeamsStore, {provide: CacheStorageAbstract, useClass: CacheLocalStorage}],
  templateUrl: '../templates/teams-detail-players.html',
  animations: [TabAnimation]
})
export class TeamsDetailPlayersComponent implements AfterViewInit, OnDestroy {

  public playersGroup: Object = {};
  @Input() public data: Object;
  @Input('teamId') private teamId: number;
  private sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private apiService: ApiService,
    private cacheService: CacheService
  ) {
    console.clear();
  }

  @HostBinding('@tabAnimation')

  public ngAfterViewInit () {
    this.sub = this.router.routerState.parent(this.route)
      .params.subscribe( (params) => {
        this.teamId = +params['id'];

        if ( !this.cacheService.exists( 'team-' + this.teamId + '-players' ) ) {
          this.getData();
          // this.asyncMockedData();
        } else {
          this.data = this.cacheService.get( 'team-' + this.teamId + '-players' );
        }
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
    this.apiService.getUrl(`teams/${this.teamId}/players`)
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
          this.playersGroup[positionName].push( player );
        } else {
          this.playersGroup[positionName].push( player );
        }
      } );

    this.data = this.playersGroup;
    this.data.count = data.count;

    if ( !this.cacheService.exists( 'team-' + this.teamId + '-players' ) ) {
      this.cacheService.set('team-' + this.teamId + '-players',
        this.data, { expires: Date.now() + 1000 * 60 * 60 });
    }
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
