import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { AppStore } from './stores/app';
import { ApiService, ScrollToY } from './services';

declare const ga: Function;

@Component({
  selector: 'app',
  providers: [CacheService, {provide: CacheStorageAbstract, useClass: CacheLocalStorage} ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'templates/app.html'
})

export class AppComponent implements OnInit {

  constructor(
    public appStore: AppStore,
    public router: Router,
    public scroller: ScrollToY,
    private cacheService: CacheService,
    private apiService: ApiService
  ) {
    console.clear();
  }

  public ngOnInit() {
    this.loadGA();

    this.router.events.subscribe((evt) => {
      if ( !( evt instanceof NavigationEnd ) ) {
        return;
      }
      this.scroller.scrollToY(0, 1500);

      ga('set', 'page', evt.url);
      ga('send', 'pageview');
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
    this.appStore.leagues = this.apiService.getUrl( 'competitions' )
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

  private loadGA() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-73037711-3', 'auto');
    ga('send', 'pageview');
  }

}
