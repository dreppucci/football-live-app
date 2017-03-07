import { Injectable } from '@angular/core';
import { Subject }  from 'rxjs/Rx';

@Injectable()
export class TeamsStandingStore {

  private standings: Subject<any> = new Subject<any>();
  private showStands: Subject<any> = new Subject<any>();

  constructor() {
    this.showStands
      .subscribe(this.standings);
  }

  public showStandings(standings) {
    if( typeof standings.standing !== 'undefined' ) {
        standings.standing
        .map( (team) => {
          let teamLink = team._links.team.href,
            teamLinkSplitted = teamLink.split('/teams/'),
            teamId = teamLinkSplitted[1];

          return team.teamId = teamId;
        } );

      this.showStands.next(standings);
    }
  }

}
