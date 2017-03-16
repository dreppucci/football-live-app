import { Component, AfterViewInit, OnChanges, OnDestroy, NgZone,
  ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'teams-detail-global',
  providers: [HttpClient, TeamsStore, {provide: CacheStorageAbstract, useClass:CacheLocalStorage}],
  templateUrl: '../templates/teams-detail-global.html'
})
export class TeamsDetailGlobalComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() public data: Object;
  @Input('teamId') private teamId: number;
  private imgFallback = require('../../assets/gfx/lgo.svg');

  constructor(
    public route: ActivatedRoute,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient,
    private cacheService: CacheService
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    this.subscribeToStoreProperty();

    if ( !this.cacheService.exists( 'team-' + this.teamId + '-global' ) ) {
      this.getData();
      // this.asyncMockedData();
    } else {
      this.data = this.cacheService.get( 'team-' + this.teamId + '-global' );
    }
  }

  public ngOnChanges() {
    this.subscribeToStoreProperty();

    if ( !this.cacheService.exists( 'team-' + this.teamId + '-global' ) ) {
      this.getData();
      // this.asyncMockedData();
    } else {
      this.data = this.cacheService.get( 'team-' + this.teamId + '-global' );
    }
  }

  public ngOnDestroy() {
    this.unsubscribeToStoreProperty();
  }

  private subscribeToStoreProperty() {
    this.teamsStore.teamInfo
      .subscribe( (data) => {
        this.data = data;
        if ( !this.cacheService.exists( 'team-' + this.teamId + '-global' ) ) {
          this.cacheService.set('team-' + this.teamId + '-global', this.data, { expires: Date.now() + 1000 * 60 * 60 });
        }
        this.cdref.detectChanges();
      } );
  }

  private getData() {
    this.http.get(`teams/${this.teamId}`)
      .subscribe(
        (data: any) => this.teamsStore.showGlobal(data.json()),
        (error) => console.log(error)
      );
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/team-global.json')
        .then((data) => {
          this.teamsStore.showGlobal(data);
        });

    });
  }

  private unsubscribeToStoreProperty() {
    this.teamsStore.teamInfo
      .unsubscribe();
  }

}
