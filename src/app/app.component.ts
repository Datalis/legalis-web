import { LayoutService } from './@shared/services/layout.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event, Scroll } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, switchMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { registerLocaleData } from '@angular/common';
import localeCU from '@angular/common/locales/es-CU';
import { NgScrollbar } from 'ngx-scrollbar';

const log = new Logger('App');

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('scrollerRef') scroller?: NgScrollbar;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');
    (window as any).removeSplash();

    registerLocaleData(localeCU, 'es-CU');

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((e) => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        switchMap((route) => route.data),
        untilDestroyed(this)
      )
      .subscribe((event) => {
        const title = event.title;
        if (title) {
          this.titleService.setTitle('Legalis - ' + title);
        }
      });

    this.router.events
      .pipe(
        filter((e: Event): e is Scroll => e instanceof Scroll),
        untilDestroyed(this)
      )
      .subscribe((e) => {
        if (e.position) {
          const [x] = e.position;
          this.scroller?.scrollTo({ top: x });
        } else if (e.anchor) {
          this.scroller?.scrollToElement(`#${e.anchor}`);
        } else {
          this.scroller?.scrollTo({ top: 0 });
        }
      });

    this.layoutService.scrollToTop$.pipe(untilDestroyed(this)).subscribe(() => this.scroller?.scrollTo({ top: 0 }));
    this.layoutService.scrollToElement$
      .pipe(untilDestroyed(this))
      .subscribe((anchor) => this.scroller?.scrollToElement(anchor));
  }
}
