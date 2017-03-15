import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppStore } from './stores/app';
import { ScrollToY }  from './services';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'templates/app.html'
})

export class AppComponent implements OnInit {

  constructor(
    public router: Router,
    public scroller: ScrollToY
  ) {}

  public ngOnInit() {
    this.router.events.subscribe((evt) => {
      if ( !( evt instanceof NavigationEnd ) ) {
        return;
      }
      this.scroller.scrollToY(0, 1500);
    });
  }

}
