import { ScreenSizeService } from '@app/@shared/services/screen-size.service';
import { debounceTime, delay, map, tap } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ScreenSize } from '../model/screen-size.enum';

@Injectable({
  providedIn: 'root',
})
export class LayoutService implements OnDestroy {
  isSmallScreen$ = new BehaviorSubject(false);

  scrollToElement$ = new Subject<string>();
  scrollToTop$ = new Subject();

  get isSmallScreen() {
    return this.isSmallScreen$.value;
  }

  private subscriptions$: Subscription[] = [];

  constructor(private _screenSize: ScreenSizeService) {
    this.subscriptions$.push(
      this._screenSize.screenSize$
        .pipe(
          map((size) => size === ScreenSize.MD || size === ScreenSize.SM || size === ScreenSize.XS),
          tap((small) => console.log('small: ' + small))
        )
        .subscribe((small) => this.isSmallScreen$.next(small))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((e) => e.unsubscribe());
  }

  scrollToTop(): void {
    this.scrollToTop$.next(true);
  }

  scrollToElement(anchor: string) {
    this.scrollToElement$.next(anchor);
  }
}
