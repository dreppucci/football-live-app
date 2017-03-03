import { Injectable } from '@angular/core';
import { Observable, Observer, Subject }  from 'rxjs/Rx';

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppState {

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

  // already return a clone of the current state
  public get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  public get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  public updateLeaguesList(leaguesJson, leagueSearching) {
    this.leagueSearching = leagueSearching;
    this.updateFilteredLeaguesL.next(leaguesJson);
  }

  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify( object ));
  }
}
