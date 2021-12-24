import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
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

  constructor(private _httpClient: HttpClient) {}

  public get<T>(path: string, params: HttpParams = new HttpParams(), disableCaching = false): Observable<T> {
    let _headers = this._headers;
    if (disableCaching) {
      _headers = this._headers.append('no-cache', '');
    }
    return this._httpClient.get<T>(path, {
      headers: _headers,
      params: params,
    });
  }

  public getFile(path: string): Observable<Blob> {
    return this._httpClient.get(path, { responseType: 'blob' });
  }
}
