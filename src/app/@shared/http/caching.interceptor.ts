import { tap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequestCacheService } from '../services/request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private _cache: RequestCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //return next.handle(req);
    if (!this.isCacheable(req)) {
      console.log('Request no cacheable: ' + req.urlWithParams);
      req = req.clone({ headers: req.headers.delete('no-cache') });
      return next.handle(req);
    }
    const cachedResponse = this._cache.get(req);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next);
  }

  sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this._cache.put(req, event);
        }
      })
    );
  }

  isCacheable(req: HttpRequest<any>): boolean {
    return req.url.indexOf('/api') != -1 && !req.headers.has('no-cache');
  }
}
