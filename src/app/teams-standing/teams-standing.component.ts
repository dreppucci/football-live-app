import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { AppStore } from '../stores/app';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'teams-standing',
  providers: [HttpClient, TeamsStore, {provide: CacheStorageAbstract, useClass:CacheLocalStorage}],
  templateUrl: '../templates/teams-standing.html'
})
export class TeamsStandingComponent implements AfterViewInit {

  @Input() private teams: Object;
  @Input('leagueId') private leagueId: string;
  @Input('fullData') private fullData: string;
  private imgFallback = require('../../assets/gfx/lgo.svg');

  constructor(
    public route: ActivatedRoute,
    public appStore: AppStore,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient,
    private cacheService: CacheService
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    this.subscribeToTeamsStore();

    if ( !this.cacheService.exists( 'league-' + this.leagueId ) ) {
      this.subscribeToAppStore();
      this.getCompetitionTable();
      // this.getMockedCompetitionTable();
    } else {
      this.teams = this.cacheService.get( 'league-' + this.leagueId );
    }
  }

  private subscribeToTeamsStore() {
    this.teamsStore.standings
      .subscribe( (data) => {
        this.teams = data;
        if ( !this.cacheService.exists( 'league-' + this.leagueId ) ) {
          this.cacheService.set('league-' + this.leagueId, this.teams, { expires: Date.now() + 1000 * 60 * 60 });
        }
        this.cdref.detectChanges();
      } );
  }

  private subscribeToAppStore() {
    this.appStore[ 'league-' + this.leagueId ] =
      this.http.get( `competitions/${this.leagueId}/leagueTable` )
      .publishReplay(1)
      .refCount()
      .share();
  }

  private getCompetitionTable() {
    this.appStore[ 'league-' + this.leagueId ].subscribe(
      (data: any) => this.teamsStore.showStandings(data.json()),
      (error) => console.log(error)
    );
  }

  private getMockedCompetitionTable() {
    setTimeout(() => {

      System.import('../../assets/mock-data/leagueTable.json')
        .then((data) => {
          this.teamsStore.showStandings(data);
        });

    });
  }

}
