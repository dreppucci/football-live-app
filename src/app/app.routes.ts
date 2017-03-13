import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { LeaguesComponent, LeaguesDetailComponent } from './leagues';
import { TeamsDetailComponent, TeamsDetailPlayersComponent,
  TeamsDetailFixturesComponent } from './teams';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'leagues', component: LeaguesComponent },
  { path: 'leagues/:id', component: LeaguesDetailComponent },
  { path: 'teams/:id', component: TeamsDetailComponent,
    children: [
      { path: '', redirectTo: 'team', pathMatch: 'full' },
      { path: 'team', component: TeamsDetailPlayersComponent },
      { path: 'fixtures', component: TeamsDetailFixturesComponent }
    ]
  },
  { path: '**',    component: NoContentComponent },
];
