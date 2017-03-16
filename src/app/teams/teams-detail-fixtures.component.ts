import { Component, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { Observable }  from 'rxjs/Rx';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';
import { TabAnimation } from '../animations';

@Component({
  selector: 'teams-detail-fixtures',
  providers: [HttpClient, TeamsStore, {provide: CacheStorageAbstract, useClass:CacheLocalStorage}],
  templateUrl: '../templates/teams-detail-fixtures.html',
  animations: [TabAnimation]
})
export class TeamsDetailFixturesComponent implements AfterViewInit, OnDestroy {

  @Input() public data: Object;
  @Input('teamId') private teamId: number;
  private width: number = window.outerWidth;
  private sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient,
    private cacheService: CacheService
  ) {
    console.clear();
  }

  @HostBinding('@tabAnimation')

  public ngAfterViewInit () {
    this.sub = this.router.routerState.parent(this.route)
      .params.subscribe( (params) => {
        this.teamId = +params['id'];

        if ( !this.cacheService.exists( 'team-' + this.teamId + '-fixtures' ) ) {
          this.getData();
          // this.asyncMockedData();
        } else {
          this.data = this.cacheService.get( 'team-' + this.teamId + '-fixtures' );
        }
      });

    this.subscribeToStoreProperty();
    this.updateWidthData();
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private subscribeToStoreProperty() {
    this.teamsStore.teamFixtures
      .subscribe( (data) => {
        this.data = data;

        if ( !this.cacheService.exists( 'team-' + this.teamId + '-fixtures' ) ) {
          this.cacheService.set('team-' + this.teamId + '-fixtures', this.data, { expires: Date.now() + 1000 * 60 * 60 });
        }

        this.cdref.detectChanges();
      } );
  }

  private updateWidthData() {
    const $resizeEvent = Observable.fromEvent(window, 'resize')
      .map(() => {
        return window.outerWidth;
      })
      .debounceTime(200);

    $resizeEvent.subscribe( (data) => {
      this.width = data;
    });
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
