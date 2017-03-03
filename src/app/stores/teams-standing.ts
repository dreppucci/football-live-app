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
    this.showStands.next(standings);
  }

}
