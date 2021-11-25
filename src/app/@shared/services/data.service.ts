import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Directory } from '../model/directory';
import { Gazette } from '../model/gazette';
import { Normative } from '../model/normative';
import { PagedResult } from '../model/paged-result';
import { APIService } from './api.service';

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
  getGazettes(): Observable<PagedResult<Gazette>> {
    return this._apiService.get<PagedResult<Gazette>>('/gacetas');
  }

  /**
   * Get all normatives
   * @returns paged @class Normative list
   */
  getNormatives(): Observable<PagedResult<Normative>> {
    return this._apiService.get<PagedResult<Normative>>('/normativas');
  }

  getNormativesByDirectory(directoryId: number): Observable<PagedResult<Normative>> {
    return this._apiService
      .get<PagedResult<Normative>>('/normativas', new HttpParams({ fromObject: { directory: directoryId } }))
      .pipe();
  }

  getNormativeById(normativeId: number): Observable<Normative> {
    return this._apiService.get<Normative>(`/normativas/${normativeId}`);
  }

  /**
   * Get all directories
   * @returns paged @class Directory list
   */
  getDirectories(): Observable<PagedResult<Directory>> {
    return this._apiService.get<PagedResult<Directory>>('/directorios');
  }

  getLatestNews(): Observable<any[]> {
    return this._apiService.get(environment.newsApiUrl);
  }
}
