import { Injectable } from '@angular/core';
import { Subject }  from 'rxjs/Rx';

@Injectable()
export class SearchLeagueStore {

  public filteredLeaguesList: Subject<any> = new Subject<any>();
  private leaguesList: Subject<any> = new Subject<any>();
  private saveLeaguesL: Subject<any> = new Subject<any>();
  private updateFilteredLeaguesL: Subject<any> = new Subject<any>();
  private leagueSearching: string;

  constructor() {
    this.saveLeaguesL
      .subscribe(
        (data: any) => this.leaguesList = data,
        (error) => console.log(error)
      );

    this.updateFilteredLeaguesL
      .map( (objs) => {
        return objs.filter( (obj) => {
          return obj.caption.toLowerCase().indexOf( this.leagueSearching.toLowerCase() ) !== -1;
        } );
      } )
      .subscribe(this.filteredLeaguesList);
  }

  public saveLeaguesList(leaguesJson) {
    this.saveLeaguesL.next(leaguesJson);
  }

  public updateLeaguesList(leagueSearching) {
    this.leagueSearching = leagueSearching.length !== 0 ? leagueSearching : 'empty';
    this.updateFilteredLeaguesL.next(this.leaguesList);
  }

}
