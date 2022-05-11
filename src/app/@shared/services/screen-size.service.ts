import { ScreenSize } from '@app/@shared/model/screen-size.enum';
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject, fromEvent, Subscription, merge, scheduled, from } from 'rxjs';
import { debounceTime, mergeAll, map } from 'rxjs/operators';
import bph from 'breakpoint-helper';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService implements OnDestroy {
  private static readonly BREAKPOINTS = {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  };

  private _bph: any;

  screenSize$ = new Subject();

  subcriptions$: Subscription[] = [];

  constructor(private zone: NgZone) {
    if (typeof window !== 'undefined') {
      this._bph = bph(ScreenSizeService.BREAKPOINTS);
      const load$ = fromEvent(window, 'load');
      const resize$ = fromEvent(window, 'resize');
      const change$ = from([load$, resize$]).pipe(mergeAll());
      this.subcriptions$.push(
        change$
          .pipe(
            map(() => Object.values(ScreenSize)),
            map((sizes) => sizes.find((s) => this.isMatching(s)))
          )
          .subscribe((size) => {
            this.screenSize$.next(size);
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.subcriptions$.forEach((s) => s.unsubscribe());
  }

  private isMatching(size: string): boolean {
    return this.zone.runOutsideAngular(() => this._bph.isMatching(size, true));
  }
}
