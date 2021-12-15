import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private readonly JSON_CONTENT_TYPE = 'application/json';
  private readonly MULTIPART_CONTENT_TYPE = '';
  private readonly FORM_URL_ENCODED_CONTENT_TYPE = '';

  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': this.JSON_CONTENT_TYPE,
    Accept: this.JSON_CONTENT_TYPE,
  });

  private _headersNoCache: HttpHeaders = new HttpHeaders({
    'Content-Type': this.JSON_CONTENT_TYPE,
    Accept: this.JSON_CONTENT_TYPE,
    'no-cache': '',
  });

  constructor(private _httpClient: HttpClient) {}

  public get<T>(path: string, params: HttpParams = new HttpParams(), disableCaching = false): Observable<T> {
    return this._httpClient.get<T>(path, {
      headers: disableCaching ? this._headersNoCache : this._headers,
      params: params,
    });
  }
}
