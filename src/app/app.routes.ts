import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { LeaguesComponent, LeaguesDetailComponent } from './leagues';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'leagues', component: LeaguesComponent },
  { path: 'leagues/:id', component: LeaguesDetailComponent },
  { path: '**',    component: NoContentComponent },
];
