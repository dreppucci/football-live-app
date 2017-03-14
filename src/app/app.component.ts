import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppStore } from './stores/app';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'templates/app.html'
})

export class AppComponent implements OnInit {

  constructor(
    public appState: AppStore
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}
