import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event, Scroll } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { filter, map, switchMap, delay, take } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { I18nService } from '@app/i18n';
import { registerLocaleData, ViewportScroller } from '@angular/common';
import localeCU from '@angular/common/locales/es-CU';

const log = new Logger('App');

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private titleService: Title //private translateService: TranslateService, //private i18nService: I18nService
  ) {}

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

    // Setup translations
    //this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    //const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

    registerLocaleData(localeCU, 'es-CU');

    // Change page title on navigation or language change, based on route data
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
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
  }

  ngOnDestroy() {
    //this.i18nService.destroy();
  }
}
