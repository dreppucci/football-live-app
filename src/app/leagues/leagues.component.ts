import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { AppStore } from '../stores/app';
import { RouteAnimation } from '../animations';

@Component({
  selector: 'leagues',
  providers: [ CacheService, {provide: CacheStorageAbstract, useClass:CacheLocalStorage} ],
  templateUrl: '../templates/leagues.html',
  animations: [RouteAnimation]
})
export class LeaguesComponent implements OnInit, OnDestroy {

  @Input() public leagues: any[] = [];

  constructor(
    public route: ActivatedRoute,
    public appStore: AppStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private cacheService: CacheService
  ) {
    console.clear();
  }

  @HostBinding('@routeAnimation')

  public ngOnInit() {
    if ( !this.cacheService.exists('leagues') ) {
      this.getData();
    } else {
      this.saveLeaguesData( this.cacheService.get('leagues') );
    }
  }

  public ngOnDestroy () {
    this.cdref.detach();
  }

  private getData() {
    this.appStore.leagues.subscribe(
      (data: any) => this.saveLeaguesData( data.json() ),
      (error) => console.log(error)
    );
  }

  private saveLeaguesData(data: Object) {
    this.leagues = this.appStore.get('leagues');
  }

}
