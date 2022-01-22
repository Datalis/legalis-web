import { HttpUrlEncoder } from './../http/http-url-encoder';
import { removeEmpty } from '@app/@shared';
import { map } from 'rxjs/operators';
import { HttpClient, HttpContext, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Params } from '../model/params';

@Injectable({
  providedIn: 'root',
})
export class APIService {

  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  constructor(private _httpClient: HttpClient) {}

  public get<T>(path: string, params?: Params, disableCaching = false, encoder = new HttpUrlEncoder()): Observable<T> {
    const _params = params ? removeEmpty(params) : {};
    return this._httpClient.get<T>(path, {
      headers: this._headers,
      params: new HttpParams({
        fromObject: _params,
        encoder
      }),
    });
  }

  public getFile(path: string): Observable<HttpResponse<Blob>> {
    return this._httpClient.get(path, { observe: 'response', responseType: 'blob' });
  }
}
