import { Component, AfterViewInit, OnChanges, OnDestroy, NgZone,
  ChangeDetectorRef, ElementRef, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';

@Component({
  selector: 'teams-detail-global',
  providers: [HttpClient, TeamsStore],
  templateUrl: '../templates/teams-detail-global.html'
})
export class TeamsDetailGlobalComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() public data: Object;
  @Input('teamId') private teamId: number;
  private imgFallback = require('../../assets/gfx/lgo.svg');

  constructor(
    public route: ActivatedRoute,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  public ngAfterViewInit () {
    this.subscribeToStoreProperty();

    this.getData();
    // this.asyncMockedData();
  }

  public ngOnChanges() {
    this.getData();
  }

  public ngOnDestroy() {
    this.unsubscribeToStoreProperty();
  }

  private subscribeToStoreProperty() {
    this.teamsStore.teamInfo
      .subscribe( (data) => {
        this.data = data;
        this.cdref.detectChanges();
      } );
  }

  private getData() {
    this.http.get(`teams/${this.teamId}`)
      .subscribe(
        (data: any) => this.teamsStore.showGlobal(data.json()),
        (error) => console.log(error)
      );
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/team-global.json')
        .then((data) => {
          this.teamsStore.showGlobal(data);
        });

    });
  }

  private unsubscribeToStoreProperty() {
    this.teamsStore.teamInfo
      .unsubscribe();
  }

}
