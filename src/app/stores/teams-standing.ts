import { Injectable } from '@angular/core';
import { Subject }  from 'rxjs/Rx';

@Injectable()
export class TeamsStandingStore {

  public standings: Subject<any> = new Subject<any>();
  private showStands: Subject<any> = new Subject<any>();

  constructor() {
    this.showStands
      .subscribe(this.standings);
  }

  public showStandings(standings) {
    if ( typeof standings.standing !== 'undefined' ) {
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

}
