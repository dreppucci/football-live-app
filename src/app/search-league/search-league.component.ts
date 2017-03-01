import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';

@Component({
  selector: 'search-league',
  templateUrl: '../templates/search-league.html'
})
export class SearchLeagueComponent implements OnInit {

  public localState = { league: '' };

  constructor(
    public route: ActivatedRoute,
    public appState: AppState
  ) {}

  public ngOnInit() {
    /*this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });*/

    console.log('hello `Search-league` component');
    // static data that is bundled
    // var mockData = require('assets/mock-data/mock-data.json');
    // console.log('mockData', mockData);
    // if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
    // this.asyncDataWithWebpack();
  }
  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.league = '';
  }
  private asyncDataWithWebpack() {
    // you can also async load mock data with 'es6-promise-loader'
    // you would do this if you don't want the mock-data bundled
    // remember that 'es6-promise-loader' is a promise
    setTimeout(() => {

      System.import('../../assets/mock-data/mock-data.json')
        .then((json) => {
          console.log('async mockData', json);
          this.localState = json;
        });

    });
  }

}
