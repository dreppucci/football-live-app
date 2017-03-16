import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { AppStore } from './stores/app';
import { HttpClient } from './services/http-client';
import { ScrollToY }  from './services';

@Component({
  selector: 'app',
  providers: [HttpClient, CacheService, {provide: CacheStorageAbstract, useClass:CacheLocalStorage} ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'templates/app.html'
})

export class AppComponent implements OnInit {

  constructor(
    public appStore: AppStore,
    public router: Router,
    public scroller: ScrollToY,
    private http: HttpClient,
    private cacheService: CacheService
  ) {
    console.clear();
  }

  public ngOnInit() {
    this.router.events.subscribe((evt) => {
      if ( !( evt instanceof NavigationEnd ) ) {
        return;
      }
      this.scroller.scrollToY(0, 1500);
    });

    if ( !this.cacheService.exists('leagues') ) {
      this.getCompetitionsData();
      // this.getCompetitionMockedData();
      this.subscribeToLeagues();
    } else {
      this.saveLeaguesData( this.cacheService.get('leagues') );
    }
  }

  private getCompetitionsData() {
    this.appStore.leagues = this.http.get( 'competitions' )
      .publishReplay(1)
      .refCount()
      .share();
  }

  private subscribeToLeagues() {
    this.appStore.leagues.subscribe(
      (data: any) => this.saveLeaguesData( data.json() ),
      (error) => console.log(error)
    );
  }

  private saveLeaguesData(data: Object) {
    this.appStore.set('leagues', data);
    if ( !this.cacheService.exists('leagues') ) {
      this.cacheService.set('leagues', data, { expires: Date.now() + 1000 * 60 * 60 });
    }
  }

  private getCompetitionMockedData() {
    setTimeout(() => {
      System.import('../assets/mock-data/competitions.json')
        .then((data) => {
          this.saveLeaguesData( data );
        });

    });
  }

}
