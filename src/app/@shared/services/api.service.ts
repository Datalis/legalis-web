import { Directory } from "./../model/directory";
import { BypassUrlEncoder } from "./../http/http-url-encoder";
import { Params } from "./../model/params";
import { removeEmpty } from "./../utils/helpers";
import { GazetteType } from "./../model/gazette-type";
import { NormativeResume } from "./../model/normative-resume";
import { GazetteResume } from "./../model/gazette-resume";
import { NormativeThematic } from "./../model/normative-thematic";
import { NormativeState } from "./../model/normative-state";
import { Infographic } from "./../model/infographic";
import { environment } from "./../../../environments/environment";
import { Gazette } from "./../model/gazette";
import { Normative } from "./../model/normative";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, firstValueFrom, filter, map, timeout } from "rxjs";
import { PagedResult } from "../model/paged-result";
import { AboutItem } from "../model/about-item";
import { HttpUrlEncoder } from "../http/http-url-encoder";
import { GlossaryTerm } from "../model/glossary-term";
import { ElToquePost, StrapiResponse } from "../model/eltoque-post";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  private _headers = new HttpHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  constructor(private client: HttpClient) {}

  encodeParams(params: Params, bypassEncoder = false): HttpParams {
    const _params = removeEmpty(params);
    return new HttpParams({
      encoder: bypassEncoder ? new BypassUrlEncoder() : new HttpUrlEncoder(),
      fromObject: _params,
    });
  }

  async search(params: any): Promise<PagedResult<Normative>> {
    let _params = Object.assign({}, params);
    // if (_params.organism && _params.organism.includes(' ')) {
    //   _params.organism = `"${_params.organism}"`;
    // }
    // if (_params.state && _params.state.includes(' ')) {
    //   _params.state = `"${_params.state}"`;
    // }
    // if (_params.tematica && _params.tematica.includes(' ')) {
    //   _params.tematica = `"${_params.tematica}"`;
    // }
    return firstValueFrom(
      this.client.get<PagedResult<Normative>>("/search", {
        headers: this._headers,
        params: this.encodeParams(_params, true),
      }),
    );
  }

  async findNormatives(params: any): Promise<PagedResult<Normative>> {
    return firstValueFrom(
      this.client.get<PagedResult<Normative>>("/normativas/", {
        params: this.encodeParams(params),
        headers: this._headers,
      }),
    );
  }

  async findGazettes(params: any): Promise<PagedResult<Gazette>> {
    return firstValueFrom(
      this.client.get<PagedResult<Gazette>>("/gacetas/", {
        params: this.encodeParams(params),
        headers: this._headers,
      }),
    );
  }

  async getGlossaryTerms(params: any): Promise<PagedResult<GlossaryTerm>> {
    return firstValueFrom(
      this.client.get<PagedResult<GlossaryTerm>>("/glosario/", {
        headers: this._headers,
        params: this.encodeParams(params),
      }),
    );
  }

  getGlossaryRefs(params: any): Observable<PagedResult<any>> {
    return this.client.get<PagedResult<any>>("/referencia/", {
      headers: this._headers,
      params: this.encodeParams(params),
    });
  }

  async getInfographics(): Promise<PagedResult<Infographic>> {
    return firstValueFrom(
      this.client.get<PagedResult<Infographic>>("/infografia/", {
        headers: this._headers,
      }),
    );
  }

  async getInfographic(id: number): Promise<Infographic> {
    return firstValueFrom(
      this.client.get<Infographic>(`/infografia/${id}`, {
        headers: this._headers,
      }),
    );
  }

  async getNormative(id: number | string): Promise<Normative> {
    return firstValueFrom(
      this.client.get<Normative>(`/normativas/${id}`, {
        headers: this._headers,
      }),
    );
  }

  async getGazette(id: string): Promise<Gazette> {
    return firstValueFrom(
      this.client.get<Gazette>(`/gacetas/${id}/`, {
        headers: this._headers,
      }),
    );
  }

  async getAboutUsDetails(): Promise<PagedResult<AboutItem>> {
    return firstValueFrom(
      this.client.get<PagedResult<AboutItem>>("/quienessomos/", {
        headers: this._headers,
      }),
    );
  }

  async getNormativeStates(): Promise<NormativeState[]> {
    return firstValueFrom(
      this.client.get<NormativeState[]>("/normativas/estados", {
        headers: this._headers,
      }),
    );
  }

  async getNormativeThematics(): Promise<NormativeThematic[]> {
    return firstValueFrom(
      this.client.get<NormativeThematic[]>("/normativas/tematicas", {
        headers: this._headers,
      }),
    );
  }

  async getNormativeOrganisms(): Promise<string[]> {
    return firstValueFrom(
      this.client.get<string[]>("/normativas/organismos", {
        headers: this._headers,
      }),
    );
  }

  async getNormativeKeywords(): Promise<string[]> {
    return firstValueFrom(
      this.client.get<string[]>("/normativas/keywords", {
        headers: this._headers,
      }),
    );
  }

  async getGazetteTypes(): Promise<GazetteType[]> {
    return firstValueFrom(
      this.client.get<GazetteType[]>("/gacetas/tipos", {
        headers: this._headers,
      }),
    );
  }

  async getGazetteResume(): Promise<GazetteResume[]> {
    return firstValueFrom(
      this.client.get<GazetteResume[]>("/gacetas/resumen", {
        headers: this._headers,
      }),
    );
  }

  async getNormativeResume(): Promise<NormativeResume[]> {
    return firstValueFrom(
      this.client.get<NormativeResume[]>("/normativas/resumen", {
        headers: this._headers,
      }),
    );
  }

  async getDirectories(): Promise<Directory[]> {
    return firstValueFrom(
      this.client
        .get<Directory[]>("/directorios", {
          headers: this._headers,
        })
        .pipe(map((dirs) => dirs.filter((e) => !!e.icon))),
    );
  }

  // api.eltoque.com (Strapi 5). Los documentId de categorías y posts son los
  // ObjectId de la base Mongo anterior.
  private readonly _elToqueJuridicoCategory = "600c46c1929b80000d284502";
  private readonly _elToqueConsultasCategory = "63c6fa3ced8925001c36c57a";

  // Cloudflare delante de api.eltoque.com deja pasar las peticiones con esta cabecera.
  private _elToqueHeaders = new HttpHeaders({
    Accept: "application/json",
    "x-application": "1",
  });

  private _elToqueListParams(category: string, extra: Record<string, string | number> = {}) {
    return {
      "filters[categories][documentId][$eq]": category,
      "sort[0]": "publish_date:desc",
      "fields[0]": "title",
      "fields[1]": "slug",
      "fields[2]": "excerpt",
      "fields[3]": "publish_date",
      "fields[4]": "feature_image_alt",
      "populate[feature_image][fields][0]": "url",
      "populate[feature_image][fields][1]": "alternativeText",
      "populate[postAuthors][fields][0]": "fullName",
      "populate[categories][fields][0]": "slug",
      ...extra,
    };
  }

  private _mapElToquePost(post: ElToquePost): ElToquePost {
    return { ...post, authors: post.postAuthors || [] };
  }

  private _getElToquePosts(params: Record<string, string | number>): Promise<ElToquePost[]> {
    return firstValueFrom(
      this.client
        .get<StrapiResponse<ElToquePost[]>>(environment.elToqueApi + "/api/posts", {
          headers: this._elToqueHeaders,
          params,
        })
        .pipe(
          timeout(10000),
          map((res) => (res.data || []).map((p) => this._mapElToquePost(p))),
        ),
    );
  }

  async relatedNews(): Promise<ElToquePost[]> {
    // Con relaciones to-many, un filtro $ne/$notIn en Strapi deja pasar posts que
    // tengan además otra categoría, así que las consultas se excluyen aquí.
    const posts = await this._getElToquePosts(
      this._elToqueListParams(this._elToqueJuridicoCategory, { "pagination[limit]": 20 }),
    );
    return posts
      .filter((p) => !p.categories?.some((c) => c.documentId === this._elToqueConsultasCategory))
      .slice(0, 10);
  }

  async consultasJuridicas(
    limit: number = 10,
    start: number = 0,
  ): Promise<ElToquePost[]> {
    return this._getElToquePosts(
      this._elToqueListParams(this._elToqueConsultasCategory, {
        "pagination[start]": start,
        "pagination[limit]": limit,
      }),
    );
  }

  async consultaDetail(documentId: string): Promise<ElToquePost> {
    return firstValueFrom(
      this.client
        .get<StrapiResponse<ElToquePost>>(`${environment.elToqueApi}/api/posts/${documentId}`, {
          headers: this._elToqueHeaders,
          params: {
            "populate[feature_image][fields][0]": "url",
            "populate[feature_image][fields][1]": "alternativeText",
            "populate[postAuthors][fields][0]": "fullName",
          },
        })
        .pipe(
          timeout(10000),
          map((res) => this._mapElToquePost(res.data)),
        ),
    );
  }

  downloadFile(url: string): Observable<HttpResponse<Blob>> {
    return this.client.get(url, { responseType: "blob", observe: "response" });
  }
}
