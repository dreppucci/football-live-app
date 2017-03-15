import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppStore, InternalStateType } from './stores/app';
import { SearchLeagueStore } from './stores/search-league';
import { TeamsStore } from './stores/teams';
import { NationalityEncoder, KeysPipe, ScrollToY } from './services';
import { HomeComponent } from './home';
import { SearchLeagueComponent } from './search-league';
import { TeamsStandingComponent } from './teams-standing';
import { LeaguesComponent, LeaguesDetailComponent } from './leagues';
import { TeamsDetailComponent, TeamsDetailGlobalComponent,
  TeamsDetailFixturesComponent, TeamsDetailPlayersComponent } from './teams';
import { AboutComponent } from './about';
import { TabsComponent, TabComponent } from './tabs';
import { NoContentComponent } from './no-content';
import { DefaultImageDirective } from './directives/img.directive';

import '../styles/App.sass';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppStore,
  SearchLeagueStore,
  TeamsStore,
  NationalityEncoder,
  ScrollToY
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    SearchLeagueComponent,
    TeamsStandingComponent,
    TeamsDetailComponent,
    TeamsDetailGlobalComponent,
    TeamsDetailFixturesComponent,
    TeamsDetailPlayersComponent,
    LeaguesComponent,
    LeaguesDetailComponent,
    TabsComponent,
    TabComponent,
    NoContentComponent,
    KeysPipe,
    DefaultImageDirective
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ],
  exports: [DefaultImageDirective]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppStore,
    public searchLeagueStore: SearchLeagueStore,
    public teamsStore: TeamsStore
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    this.appState._state = store.state;
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    const state = this.appState._state;
    store.state = state;
    store.disposeOldHosts = createNewHosts(cmpLocation);
    store.restoreInputValues  = createInputTransfer();
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
