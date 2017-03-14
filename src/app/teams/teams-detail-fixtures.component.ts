import { Component, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, Input, HostBinding } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TeamsStore } from '../stores/teams';
import { HttpClient } from '../services/http-client';
import { TabAnimation } from '../animations';

@Component({
  selector: 'teams-detail-fixtures',
  providers: [HttpClient, TeamsStore],
  templateUrl: '../templates/teams-detail-fixtures.html',
  animations: [TabAnimation]
})
export class TeamsDetailFixturesComponent implements AfterViewInit, OnDestroy {

  @Input() public data: Object;
  @Input('teamId') private teamId: number;
  private sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private teamsStore: TeamsStore,
    private ngzone: NgZone,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
  ) {
    console.clear();
  }

  @HostBinding('@tabAnimation')

  public ngAfterViewInit () {
    this.sub = this.router.routerState.parent(this.route)
      .params.subscribe( (params) => {
        this.teamId = +params['id'];

        this.getData();
        // this.asyncMockedData();
      });

    this.subscribeToStoreProperty();
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private subscribeToStoreProperty() {
    this.teamsStore.teamFixtures
      .subscribe( (data) => {
        this.data = data;
        this.cdref.detectChanges();
      } );
  }

  private getData() {
    this.http.get(`teams/${this.teamId}/fixtures`)
      .subscribe(
        (data: any) => this.teamsStore.showFixtures(data.json()),
        (error) => console.log(error)
      );
  }

  private asyncMockedData() {
    setTimeout(() => {

      System.import('../../assets/mock-data/fixtures.json')
        .then((data) => {
          this.teamsStore.showFixtures(data);
        });

    });
  }

  private unsubscribeToStoreProperty() {
    this.teamsStore.teamFixtures
      .unsubscribe();
  }

}
