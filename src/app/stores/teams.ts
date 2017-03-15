import { Injectable } from '@angular/core';
import { Subject }  from 'rxjs/Rx';
import { NationalityEncoder }  from './../services';

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

  constructor(
    private nationalityEncoder: NationalityEncoder
  ) {
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
    if ( global.hasOwnProperty('name') ) {
      this.showGlob.next( global );
    }
  }

  public showFixtures(fixtures) {
    if ( fixtures.hasOwnProperty('fixtures') ) {
      fixtures.fixtures
        .map( (fixture) => {
          let homeTeamLink = fixture._links.homeTeam.href;
          let homeTeamLinkId = homeTeamLink.split('/teams/');
          let awayTeamLink = fixture._links.awayTeam.href;
          let awayTeamLinkId = awayTeamLink.split('/teams/');

          return fixture.homeTeamLink = homeTeamLinkId[1], fixture.awayTeamLink = awayTeamLinkId[1];
        } );
      this.showFixs.next( fixtures );
    }
  }

  public showPlayers(players) {

    if ( players.hasOwnProperty('players') ) {
      // SORT ARRAY BY POSITION AND JERSEYNUMBER ORDER
      players.players.sort( (a, b) => {
        return this.cmp(
          [ this.cmp( a.position, b.position ), this.cmp( a.jerseyNumber, b.jerseyNumber ) ],
          [ this.cmp( b.position, a.position ), this.cmp( b.jerseyNumber, a.jerseyNumber ) ]
        );
      } );

      players.players
        .map( (player) => {
          // CALCULATE AGE
          let birthDayTime = new Date(player.dateOfBirth).getTime();
          let timeDiff = Math.abs( Date.now() - birthDayTime );
          let age = Math.floor( ( timeDiff / ( 1000 * 3600 * 24 ) ) / 365 );

          // DECLARE NATIONCODE
          let nationCode = typeof this.nationalityEncoder !== 'undefined' ?
            this.nationalityEncoder.getCode(player.nationality) : '';

          return player.nationCode = nationCode, player.age = age;
        } );

      this.showPlays.next(players);
    }
  }

  private cmp(x, y) {
    return x > y ? 1 : x < y ? -1 : 0;
  }

}
