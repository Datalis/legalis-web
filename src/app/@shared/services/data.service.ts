import { NormativeThematic } from './../model/normative-thematic';
import { NormativeState } from './../model/normative-state';
import { GazetteType } from './../model/gazette-type';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { share, map, take } from 'rxjs/operators';
import { Directory } from '../model/directory';
import { Gazette } from '../model/gazette';
import { Normative } from '../model/normative';
import { PagedResult } from '../model/paged-result';
import { APIService } from './api.service';
import { GlossaryTerm } from '../model/glossary-term';
import { Params } from '../model/params';
import { GazetteResume } from '../model/gazette-resume';
import { Infographic } from '../model/infographic';

@Injectable({
  providedIn: 'root',
})
export class DataService {

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
    'Ñ',
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

  constructor(private _apiService: APIService) { }

  get letters$() {
    return of(this.letters).pipe(share());
  }

  getLatestGazette() {
    const params = new Params();
    params.page_size = 1;
    params.page = 1;
    return this.getGazetteList(params).pipe(map((res) => res.results?.[0] || null))
  }

  /** Replace */
  recentNormative(params: any): Observable<any[]> {
    return this._apiService
      .get<any>(
        '/normativas',
        params
      )
      .pipe(
        map((res) => res.results),
        take(10)
      );
  }

  /** Replace */
  popularNormative(): Observable<any[]> {
    return this._apiService
      .get<any>(
        '/normativas',
        Params.fromObject({
          ordering: '',
          year: 2021,
        })
      )
      .pipe(
        map((res) => res.results),
        take(10)
      );
  }

  getGazetteList(params: Params) {
    return this._apiService.get<PagedResult<Gazette>>('/gacetas', params);
  }

  getGazetteById(gazetteId: string) {
    return this._apiService.get<Gazette>(`/gacetas/${gazetteId}/`);
  }

  getGazetteTypes() {
    return this._apiService.get<GazetteType[]>('/gacetas/tipos');
  }

  getGazettesResume() {
    return this._apiService.get<GazetteResume[]>('/gacetas/resumen').pipe(share());
  }

  getNormativeList(params: Params): Observable<PagedResult<Normative>> {
    return this._apiService.get('/normativas', params);
  }

  getNormativeById(normativeId: number) {
    return this._apiService.get<Normative>(`/normativas/${normativeId}`);
  }

  getGlossaryTerms(params: Params) {
    return this._apiService.get<PagedResult<GlossaryTerm>>('/glosario', params);
  }

  getNormativeStates() {
    return this._apiService.get<NormativeState[]>('/normativas/estados').pipe(share());
  }

  getNormativeThematics() {
    return this._apiService.get<NormativeThematic[]>('/normativas/tematicas').pipe(
      map(res => res.splice(0,20)),
      share()
    );
  }

  getNormativeKeywords() {
    return this._apiService.get<string[]>('/normativas/keywords').pipe(share());
  }

  getNormativeOrganisms() {
    return this._apiService.get<string[]>('/normativas/organismos').pipe(share());
  }

  getNormativesResume() {
    return this._apiService.get<any[]>('/normativas/resumen').pipe(share());
  }

  getDirectories() {
    return this._apiService.get<Directory[]>('/directorios').pipe(share());
  }

  getLatestNews() {
    return this._apiService.get<any[]>(environment.newsApiUrl).pipe(share());
  }

  getInfographics() {
    return this._apiService.get<PagedResult<Infographic>>('/infografia')
  }

  getInfographic(id: number) {
    return this._apiService.get<Infographic>(`/infografia/${id}`);
  }

  getSearchResults(params: Params): Observable<PagedResult<Normative>> {
    return this._apiService.get(
      '/search',
      params,
      true
    );
  }

  getAboutUsInfo(): Observable<any> {
    return this._apiService.get('/quienessomos');
  }

  downloadFile(url: string) {
    return this._apiService.getFile(url);
  }
}
