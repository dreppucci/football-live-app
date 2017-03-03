import { Component, AfterViewInit, NgZone, ChangeDetectorRef,
  ApplicationRef, ViewChild, ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';
import { HttpClient } from '../services/http-client';

import { Observable, Observer, Subject }  from 'rxjs/Rx';

@Component({
  selector: 'top-three-standings',
  providers: [HttpClient],
  templateUrl: '../templates/top-three-standings.html'
})
export class TopThreeStandingsComponent implements AfterViewInit {

  public localState: any;

  constructor(
    public route: ActivatedRoute,
    public appState: AppState,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private appref: ApplicationRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    // DO STUFF
  }

  private getLeagueStanding() {
    return this.http.get('competitions')
    .subscribe(
      (data: any) => console.log(data),
      (error) => console.log(error)
    );
  }

}
