import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event, Router, RouteReuseStrategy, RouterModule, Scroll, UrlSerializer } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { RouteReusableStrategy, ApiPrefixInterceptor, ErrorHandlerInterceptor, SharedModule } from '@shared';

import { HomeModule } from './features/home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './features/about/about.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { CachingInterceptor } from './@shared/http/caching.interceptor';
import { RouterUrlSerializer } from './@shared/router-url-serializer';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule.forRoot(),
    NgbModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AboutModule,
    LoadingBarModule,
    //LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    //AuthModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true,
    },
    {
      provide: UrlSerializer,
      useClass: RouterUrlSerializer,
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
