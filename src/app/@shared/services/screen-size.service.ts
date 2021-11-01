import { Injectable, NgZone } from '@angular/core';
import { from, fromEvent } from 'rxjs';
import { map, mergeAll, distinctUntilChanged, delay, shareReplay } from 'rxjs/operators';
import { ScreenSize } from '../model/screen-size.enum';
import bph from 'breakpoint-helper';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  private static readonly BREAKPOINTS = {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  };

  private _bph: any;

  screenSize$ = from([fromEvent(window, 'load'), fromEvent(window, 'resize')])
    .pipe(
      delay(100),
      mergeAll(),
      map(() => Object.values(ScreenSize)),
      map((sizes) => sizes.find((s) => this.isMatching(s)))
    )
    .pipe(distinctUntilChanged());

  constructor(private zone: NgZone) {
    this._bph = bph(ScreenSizeService.BREAKPOINTS);
  }

  private isMatching(size: string): boolean {
    return this.zone.runOutsideAngular(() => this._bph.isMatching(size, true));
  }
}
