import { removeEmpty } from '@app/@shared';
import { HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, refCount, share, shareReplay, map, take } from 'rxjs/operators';
import { HttpUrlEncoder } from '../http/http-url-encoder';
import { Directory } from '../model/directory';
import { Gazette } from '../model/gazette';
import { Normative } from '../model/normative';
import { PagedResult } from '../model/paged-result';
import { SearchResult } from '../model/search-result';
import { APIService } from './api.service';
import { GlossaryTerm } from '../model/glossary-term';
import { Params } from '../model/params';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  mockOrganisms: string[] = ['Organismo 1', 'Organismo 2', 'Organismo 3'];

  gazetteTypes: string[] = [
    'Ordinaria',
    'Extraordinaria',
    'Especiales',
    'Ordinaria Especiales',
    'Extraordinarias Especiales',
  ];

  letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  constructor(private _apiService: APIService) {}

  get letters$() {
    return of(this.letters).pipe(share());
  }

  get gazetteTypes$() {
    return of(this.gazetteTypes);
  }

  recentNormative(params: any): Observable<any[]> {
    return this._apiService
      .get<any>(
        '/normativas',
        new HttpParams({
          fromObject: {
            ...params,
          },
          encoder: new HttpUrlEncoder(),
        })
      )
      .pipe(
        map((res) => res.results),
        take(10)
      );
  }

  popularNormative(): Observable<any[]> {
    return this._apiService
      .get<any>(
        '/normativas',
        new HttpParams({
          fromObject: {
            ordering: '',
            year: 2021,
          },
          encoder: new HttpUrlEncoder(),
        })
      )
      .pipe(
        map((res) => res.results),
        take(10)
      );
  }

  getGazettes(params: Params): Observable<PagedResult<Gazette>> {
    let _params = removeEmpty(params);
    return this._apiService.get<PagedResult<Gazette>>(
      '/gacetas',
      new HttpParams({
        fromObject: _params,
        encoder: new HttpUrlEncoder(),
      })
    );
  }

  getGazetteById(id: string): Observable<Gazette> {
    return this._apiService.get<Gazette>(`/gacetas/${id}/`);
  }

  getNormatives(params: Params): Observable<PagedResult<Normative>> {
    let _params = removeEmpty(params);
    return this._apiService.get(
      '/normativas',
      new HttpParams({
        fromObject: _params,
        encoder: new HttpUrlEncoder(),
      })
    );
  }

  getGlossaryTerms(page = 1, itemsPerPage = 10): Observable<PagedResult<GlossaryTerm>> {
    return this._apiService.get(
      '/glosario',
      new HttpParams({
        fromObject: {
          page,
          page_size: itemsPerPage,
        },
      })
    );
  }

  getNormativeById(normativeId: number): Observable<Normative> {
    return this._apiService.get<Normative>(`/normativas/${normativeId}`);
  }

  getStates(): Observable<string[]> {
    return this._apiService.get<string[]>('/normativas/estados').pipe(share());
  }

  getThematics(): Observable<string[]> {
    return this._apiService.get<string[]>('/normativas/tematicas').pipe(share());
  }

  getKeywords(): Observable<string[]> {
    return this._apiService.get<string[]>('/normativas/keywords').pipe(share());
  }

  getOrganisms(): Observable<string[]> {
    return this._apiService.get<string[]>('/normativas/organismos').pipe(share());
  }

  getGazettesResume(): Observable<any[]> {
    return this._apiService.get<any[]>('/gacetas/resumen').pipe(share());
  }

  getNormativesResume(): Observable<any[]> {
    return this._apiService.get<any[]>('/normativas/resumen').pipe(share());
  }

  getDirectories(): Observable<PagedResult<Directory>> {
    return this._apiService.get<PagedResult<Directory>>('/directorios').pipe(share());
  }

  getLatestNews(): Observable<any[]> {
    return this._apiService.get<any[]>(environment.newsApiUrl).pipe(share());
  }

  getSearchResults(params: Params): Observable<PagedResult<SearchResult>> {
    let _params = removeEmpty(params);
    return this._apiService.get(
      '/search',
      new HttpParams({
        fromObject: _params,
        encoder: new HttpUrlEncoder(),
      }),
      true
    );
  }

  downloadFile(url: string): Observable<Blob> {
    return this._apiService.getFile(url);
  }
}
