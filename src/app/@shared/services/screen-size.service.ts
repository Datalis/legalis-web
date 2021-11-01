import { Injectable } from '@angular/core';
import { BehaviorSubject, from, fromEvent, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, mergeAll } from 'rxjs/operators';
import { ScreenSize } from '../model/screen-size.enum';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  screenSize$ = from([fromEvent(window, 'load'), fromEvent(window, 'resize')]).pipe(
    mergeAll(),
    map(() => Object.values(ScreenSize)),
    map((sizes) => {})
  );
}
