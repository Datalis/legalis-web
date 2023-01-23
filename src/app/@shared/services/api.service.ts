import { Directory } from './../model/directory';
import { BypassUrlEncoder } from './../http/http-url-encoder';
import { Params } from './../model/params';
import { removeEmpty } from './../utils/helpers';
import { GazetteType } from './../model/gazette-type';
import { NormativeResume } from './../model/normative-resume';
import { GazetteResume } from './../model/gazette-resume';
import { NormativeThematic } from './../model/normative-thematic';
import { NormativeState } from './../model/normative-state';
import { Infographic } from './../model/infographic';
import { environment } from './../../../environments/environment';
import { Gazette } from './../model/gazette';
import { Normative } from './../model/normative';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, filter, map } from 'rxjs';
import { PagedResult } from '../model/paged-result';
import { AboutItem } from '../model/about-item';
import { HttpUrlEncoder } from '../http/http-url-encoder';
import { GlossaryTerm } from '../model/glossary-term';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(private client: HttpClient) { }

  encodeParams(params: Params, bypassEncoder = false): HttpParams {
    const _params = removeEmpty(params);
    return new HttpParams({
      encoder: bypassEncoder ? new BypassUrlEncoder() : new HttpUrlEncoder(),
      fromObject: _params,
    });
  }

  async search(params: any): Promise<PagedResult<Normative>> {
    let _params = Object.assign({}, params);
    if (_params.organism && _params.organism.includes(' ')) {
      _params.organism = `"${_params.organism}"`;
    }
    if (_params.state && _params.state.includes(' ')) {
      _params.state = `"${_params.state}"`;
    }
    if (_params.tematica && _params.tematica.includes(' ')) {
      _params.tematica = `"${_params.tematica}"`;
    }
    return firstValueFrom(
      this.client.get<PagedResult<Normative>>('/search', {
        headers: this._headers,
        params: this.encodeParams(_params, true),
      })
    );
  }

  async findNormatives(params: any): Promise<PagedResult<Normative>> {
    return firstValueFrom(
      this.client.get<PagedResult<Normative>>('/normativas/', {
        params: this.encodeParams(params),
        headers: this._headers,
      })
    );
  }

  async findGazettes(params: any): Promise<PagedResult<Gazette>> {
    return firstValueFrom(
      this.client.get<PagedResult<Gazette>>('/gacetas/', {
        params: this.encodeParams(params),
        headers: this._headers,
      })
    );
  }

  async getGlossaryTerms(params: any): Promise<PagedResult<GlossaryTerm>> {
    return firstValueFrom(
      this.client.get<PagedResult<GlossaryTerm>>('/glosario/', {
        headers: this._headers,
        params: this.encodeParams(params),
      })
    );
  }

  getGlossaryRefs(params: any): Observable<PagedResult<any>> {
    return this.client.get<PagedResult<any>>('/referencia/', {
      headers: this._headers,
      params: this.encodeParams(params),
    })
  }

  async getInfographics(): Promise<PagedResult<Infographic>> {
    return firstValueFrom(
      this.client.get<PagedResult<Infographic>>('/infografia/', {
        headers: this._headers,
      })
    );
  }

  async getInfographic(id: number): Promise<Infographic> {
    return firstValueFrom(
      this.client.get<Infographic>(`/infografia/${id}`, {
        headers: this._headers,
      })
    );
  }

  async getNormative(id: number): Promise<Normative> {
    return firstValueFrom(
      this.client.get<Normative>(`/normativas/${id}`, {
        headers: this._headers,
      })
    );
  }

  async getGazette(id: string): Promise<Gazette> {
    return firstValueFrom(
      this.client.get<Gazette>(`/gacetas/${id}/`, {
        headers: this._headers,
      })
    );
  }

  async getAboutUsDetails(): Promise<PagedResult<AboutItem>> {
    return firstValueFrom(
      this.client.get<PagedResult<AboutItem>>('/quienessomos/', {
        headers: this._headers,
      })
    );
  }

  async getNormativeStates(): Promise<NormativeState[]> {
    return firstValueFrom(
      this.client.get<NormativeState[]>('/normativas/estados', {
        headers: this._headers,
      })
    );
  }

  async getNormativeThematics(): Promise<NormativeThematic[]> {
    return firstValueFrom(
      this.client.get<NormativeThematic[]>('/normativas/tematicas', {
        headers: this._headers,
      })
    );
  }

  async getNormativeOrganisms(): Promise<string[]> {
    return firstValueFrom(
      this.client.get<string[]>('/normativas/organismos', {
        headers: this._headers,
      })
    );
  }

  async getNormativeKeywords(): Promise<string[]> {
    return firstValueFrom(
      this.client.get<string[]>('/normativas/keywords', {
        headers: this._headers,
      })
    );
  }

  async getGazetteTypes(): Promise<GazetteType[]> {
    return firstValueFrom(
      this.client.get<GazetteType[]>('/gacetas/tipos', {
        headers: this._headers,
      })
    );
  }

  async getGazetteResume(): Promise<GazetteResume[]> {
    return firstValueFrom(
      this.client.get<GazetteResume[]>('/gacetas/resumen', {
        headers: this._headers,
      })
    );
  }

  async getNormativeResume(): Promise<NormativeResume[]> {
    return firstValueFrom(
      this.client.get<NormativeResume[]>('/normativas/resumen', {
        headers: this._headers,
      })
    );
  }

  async getDirectories(): Promise<Directory[]> {
    return firstValueFrom(
      this.client
        .get<Directory[]>('/directorios', {
          headers: this._headers,
        })
        .pipe(map((dirs) => dirs.filter((e) => !!e.icon)))
    );
  }

  async relatedNews(): Promise<any[]> {
    return firstValueFrom<any[]>(this.client.get<any[]>(environment.elToqueApi + '/posts?categories=600c46c1929b80000d284502&_sort=publish_date:DESC&_limit=10'));
  }

  async consultasJuridicas(limit: number = 10, start: number = 0): Promise<any[]> {
    return firstValueFrom<any[]>(this.client.get<any[]>(
      environment.elToqueApi + '/posts?categories=63c6fa3ced8925001c36c57a&_sort=publish_date:DESC', { params: { '_limit': limit, '_start': start } }));
  }

  async consultaDetail(id: string): Promise<any> {
    return firstValueFrom<any>(this.client.get(environment.elToqueApi + '/posts/' + id));
  }

  downloadFile(url: string): Observable<HttpResponse<Blob>> {
    return this.client.get(url, { responseType: 'blob', observe: 'response' });
  }
}
