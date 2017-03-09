import { Injectable } from '@angular/core';
import { Subject }  from 'rxjs/Rx';

@Injectable()
export class TeamsStore {

  public standings: Subject<any> = new Subject<any>();
  public teamInfo: Subject<any> = new Subject<any>();
  public teamFixtures: Subject<any> = new Subject<any>();
  public teamPlayers: Subject<any> = new Subject<any>();
  private showStands: Subject<any> = new Subject<any>();
  private showGlob: Subject<any> = new Subject<any>();
  private showFixs: Subject<any> = new Subject<any>();
  private showPlays: Subject<any> = new Subject<any>();

  constructor() {
    this.showStands
      .subscribe(this.standings);

    this.showGlob
      .subscribe(this.teamInfo);

    this.showFixs
      .subscribe(this.teamFixtures);

    this.showPlays
      .subscribe(this.teamPlayers);

  }

  public showStandings(standings) {
    if ( standings.hasOwnProperty('standing') ) {
      standings.standing
        .map( (team) => {
          let teamLink = team._links.team.href;
          let teamLinkSplitted = teamLink.split('/teams/');
          let teamId = teamLinkSplitted[1];

          return team.teamId = teamId;
      } );

      this.showStands.next(standings);
    }
  }

  public showGlobal(global) {
    if ( global.hasOwnProperty('name') ) this.showGlob.next(global);
  }

  public showFixtures(fixtures) {
    if ( fixtures.hasOwnProperty('fixtures') ) this.showFixs.next(fixtures);
  }

  public showPlayers(players) {
    if ( players.hasOwnProperty('players') ) this.showPlays.next(players);
  }

}
