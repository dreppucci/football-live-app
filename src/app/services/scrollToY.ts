import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class ScrollToY {

  private easingEquations: Object = {
    easeOutSine (pos) {
      return Math.sin(pos * (Math.PI / 2));
    },
    easeInOutSine (pos) {
      return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    },
    easeInOutQuint (pos) {
      let finalPos = pos /= 0.5;
      if ( finalPos < 1 ) {
          return 0.5 * Math.pow(pos, 5);
      }
      return 0.5 * (Math.pow((pos - 2), 5) + 2);
    }
  };

  public scrollToY(innerScrollTargetY, innerSpeed, innerEasing) {
    let scrollY = window.scrollY;
    let scrollTargetY = innerScrollTargetY || 0;
    let speed = innerSpeed || 2000;
    let easing = innerEasing || 'easeInOutQuint';
    let currentTime = 0;
    let time = Math.max(.1, Math.min(
      Math.abs(scrollY - scrollTargetY) / speed, .8));

    let tick = () => {
      currentTime += 1 / 60;
      let p = currentTime / time;
      let t = this.easingEquations[easing](p);

      if (p < 1) {
        requestAnimationFrame(tick);
        window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
      } else {
        window.scrollTo(0, scrollTargetY);
      }
    };

    tick();
  }
}
