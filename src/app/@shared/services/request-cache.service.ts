import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface CachedRequest {
  data: HttpResponse<any>;
  expires: number;
}

@Injectable({
  providedIn: 'root',
})
export class RequestCacheService {
  private _cacheMap: Map<string, CachedRequest> = new Map();

  constructor() {}

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const cached = this._cacheMap.get(req.urlWithParams);
    if (!cached) return null;
    if (cached.expires <= Date.now()) {
      // expired
      this._cacheMap.delete(req.urlWithParams);
      return null;
    }
    return cached.data;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>) {
    const EXPIRES = Date.now() + (1000 * 60 * 60) / 2;
    const cache: CachedRequest = {
      data: res,
      expires: EXPIRES,
    };
    this._cacheMap.set(req.urlWithParams, cache);
  }
}
