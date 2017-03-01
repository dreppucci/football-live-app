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
  // TypeScript public modifiers
  constructor(
    public appState: AppState
  ) {}
}
