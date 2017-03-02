import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';

@Component({
  selector: 'home',
  templateUrl: '../templates/home.html'
})
export class HomeComponent {
  constructor(
    public appState: AppState
  ) {}
}
