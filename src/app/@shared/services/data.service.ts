import { removeEmpty } from '@app/@shared';
import { HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, refCount, share, shareReplay } from 'rxjs/operators';
import { HttpUrlEncoder } from '../http/http-url-encoder';
import { Directory } from '../model/directory';
import { Gazette } from '../model/gazette';
import { Normative } from '../model/normative';
import { PagedResult } from '../model/paged-result';
import { SearchResult } from '../model/search-result';
import { APIService } from './api.service';
import { GlossaryTerm } from '../model/glossary-term';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private recent = [
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
  ];

  private popular = [
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
    {
      title: 'Título de la norma',
      subject: 'Temática',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      keywords: ['Palabra clave 1', 'Palabra clave 2'],
    },
  ];

  gazetteTypes: string[] = [
    'Ordinaria',
    'Extraordinaria',
    'Especiales',
    'Ordinaria Especiales',
    'Extraordinarias Especiales',
  ];

  constructor(private _apiService: APIService) {}

  recentNormative(): Observable<any[]> {
    return of(this.recent);
  }

  popularNormative(): Observable<any[]> {
    return of(this.popular);
  }

  /**
   * Get all gazettes
   * @returns paged @class Gazette list
   */
  getGazettes(
    type: string | null,
    year: number | null,
    year_gte: number | null,
    year_lte: number | null,
    thematic: string | null,
    page: number,
    itemsPerPage = 10
  ): Observable<PagedResult<Gazette>> {
    let params: any = {
      type,
      year,
      year_gte,
      year_lte,
      tematica: thematic,
      page,
      page_size: itemsPerPage,
    };
    params = removeEmpty(params);

    return this._apiService.get<PagedResult<Gazette>>(
      '/gacetas',
      new HttpParams({
        fromObject: { ...params },
      })
    );
  }

  getGazetteTypes(): Observable<string[]> {
    return of(this.gazetteTypes);
  }

  /**
   * Get all normatives
   * @returns paged @class Normative list
   */
  getNormatives(
    year: number | null,
    year_gte: number | null,
    year_lte: number | null,
    state: string | null,
    keyword: string | null,
    organism: string | null,
    page: number,
    page_size?: number
  ): Observable<PagedResult<Normative>> {
    let params: any = {
      year,
      year_gte,
      year_lte,
      state,
      keyword,
      organism,
      page,
      page_size,
    };
    params = removeEmpty(params);
    return this._apiService.get(
      '/normativas',
      new HttpParams({
        fromObject: {
          ...params,
        },
        encoder: new HttpUrlEncoder(),
      })
    );
  }

  getNormativesByDirectory(directory: number, page = 1, itemsPerPage = 10): Observable<PagedResult<Normative>> {
    let params: any = {
      directory,
      page,
      page_size: itemsPerPage,
    };
    params = removeEmpty(params);
    return this._apiService.get<PagedResult<Normative>>(
      '/normativas',
      new HttpParams({
        fromObject: {
          ...params,
        },
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

  getNormativeStates(): Observable<string[]> {
    return this._apiService.get<string[]>('/normativas/estados').pipe(share());
  }

  getNormativeThematics(): Observable<string[]> {
    return this._apiService.get<string[]>('/normativas/tematicas').pipe(share());
  }

  getNormativeKeywords(): Observable<string[]> {
    return this._apiService.get('/normativas/keywords');
  }

  /**
   * Get all directories
   * @returns paged @class Directory list
   */
  getDirectories(): Observable<PagedResult<Directory>> {
    return this._apiService.get<PagedResult<Directory>>('/directorios');
  }

  getLatestNews(): Observable<any[]> {
    return this._apiService.get<any[]>(environment.newsApiUrl).pipe(share());
  }

  getSearchResults(
    query: string,
    year: number | null,
    year_gte: number | null,
    year_lte: number | null,
    state: string | null,
    keyword: string | null,
    organism: string | null,
    thematic: string | null,
    page: number,
    page_size?: number
  ): Observable<PagedResult<SearchResult>> {
    let params: any = {
      text: query,
      year,
      year_gte,
      year_lte,
      state,
      keyword,
      organism,
      tematica: thematic,
      page,
      page_size,
    };
    params = removeEmpty(params);
    return this._apiService.get(
      '/search',
      new HttpParams({
        fromObject: {
          ...params,
        },
        encoder: new HttpUrlEncoder(),
      }),
      true
    );
  }
}
