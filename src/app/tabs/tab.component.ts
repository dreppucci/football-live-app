import { Component, Input } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: '../templates/tab.html'
})
export class TabComponent {
  @Input() public title: string;
  @Input() public href: string;
  @Input() public innerContent: string;
  @Input() public active = false;
}
