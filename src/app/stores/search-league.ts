import { Injectable } from '@angular/core';
import { Observable, Observer, Subject }  from 'rxjs/Rx';

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class SearchLeagueStore {

  public _state: InternalStateType = { };
  private filteredLeaguesList: Subject<any> = new Subject<any>();
  private updateFilteredLeaguesL: Subject<any> = new Subject<any>();
  private leagueSearching: string;

  constructor() {
    this.updateFilteredLeaguesL
      .map( (objs) => {
        return objs.filter( (obj) => {
          return obj.caption.toLowerCase().indexOf( this.leagueSearching.toLowerCase() ) !== -1;
        } );
      } )
      .subscribe(this.filteredLeaguesList);
  }

  public updateLeaguesList(leaguesJson, leagueSearching) {
    this.leagueSearching = leagueSearching;
    this.updateFilteredLeaguesL.next(leaguesJson);
  }

}