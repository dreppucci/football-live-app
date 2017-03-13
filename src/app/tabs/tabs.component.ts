import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab.component';

@Component({
  selector: 'tabs',
  templateUrl: '../templates/tabs.html'
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) public tabs: QueryList<TabComponent>;

  public ngAfterContentInit() {
    let activeTabs = this.tabs.filter( (tab) => tab.active );

    if ( activeTabs.length === 0 ) {
      this.selectTab(this.tabs.first);
    }
  }

  private selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach( (localTab) => {
      localTab.active = false;
    } );
    tab.active = true;
  }

}
