import { HttpResponse } from '@angular/common/http';
import { PdfViewerComponent } from './../../@shared/components/pdf-viewer/pdf-viewer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { groupBy } from './../../@shared/utils/helpers';
import { GazetteType } from './../../@shared/model/gazette-type';
import { NormativeThematic } from './../../@shared/model/normative-thematic';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { LayoutService } from './../../@shared/services/layout.service';
import { Params } from '@app/@shared/model/params';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Gazette } from '@app/@shared/model/gazette';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, Subscription, combineLatest, forkJoin, throwError, EMPTY, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FiltersComponent } from '@app/@shared/components/filters/filters.component';
import { flatten, range } from '@app/@shared';
import { GazetteResume } from '@app/@shared/model/gazette-resume';
import { NormativeResume } from '@app/@shared/model/normative-resume';
import { NormativeType } from '@app/@shared/model/normative-type';

@UntilDestroy()
@Component({
  selector: 'app-gazettes',
  templateUrl: './gazettes.component.html',
  styleUrls: ['./gazettes.component.scss'],
})
export class GazettesComponent implements OnInit {
  isLoading = true;

  thematics: NormativeThematic[] = [];
  types: GazetteType[] = [];
  organisms: string[] = [];
  gazettesResume: GazetteResume[] = [];
  normativesResume: NormativeResume[] = [];

  params = new Params({
    page_size: 5,
    //year: 2021
  });

  resume: any = null;
  resumeMenuCollapsed = true;

  results$?: Observable<PagedResult<Gazette> | null>;

  @ViewChild('filterMobile', { read: FiltersComponent }) filterMobile?: FiltersComponent;

  /*get resume() {
    const gazettesYear = this.gazettesResume.find((e) => e.year == this.params.year);
    const gazettesTotal = gazettesYear?.types.map((t: any) => t.count).reduce((p: number, c: number) => p + c, 0);
    const normativesYear = this.normativesResume.find((e) => e.year == this.params.year);
    const normativesTotal = normativesYear?.types.map((t: any) => t.count).reduce((p: number, c: number) => p + c, 0);
    return {
      gazette: gazettesYear,
      gazettesTotal,
      normative: normativesYear,
      normativesTotal,
    };
  }*/

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _layout: LayoutService,
    private _modal: NgbModal
  ) { }

  ngOnInit() {
    this._route.queryParams
      .pipe(
        tap(() => this.results$ = EMPTY),
        untilDestroyed(this),
        switchMap(params => {
          return forkJoin([
            this._dataService.getNormativeThematics(),
            this._dataService.getNormativesResume(),
            this._dataService.getNormativeOrganisms(),
            this._dataService.getGazettesResume(),
            this._dataService.getGazetteTypes(),
          ]).pipe(
            map(res => ({ params, data: res })),
            tap(() => this.isLoading = false)
          )
        })
      )
      .subscribe(({params, data}) => {
        this.thematics = data[0] || [];
        this.normativesResume = data[1] || [];
        this.organisms = data[2] || [];
        this.gazettesResume = data[3] || [];
        this.types = data[4] || [];

        this.params = new Params({
          ...this.params,
          ...params
        })

        if (this.params.year) {
          this.resume = {
            year: this.params.year,
            normatives: this.getNormativeResumeByYear(this.params.year),
            gazettes: this.getGazetteResumeByYear(this.params.year)
          }
        } else if (this.params.year_gte && this.params.year_lte) {
          this.resume = {
            year: this.params.year_gte,
            year_end: this.params.year_lte,
            normatives: this.getNormativeResumeByRange(this.params.year_gte, this.params.year_lte),
            gazettes: this.getGazetteResumeByRange(this.params.year_gte, this.params.year_lte),
          }
        } else {
          this.resume = {
            year: 1990,
            year_end: 2022,
            normatives: this.getNormativeResumeByRange(1990, 2022),
            gazettes: this.getGazetteResumeByRange(1990, 2022),
          }
        }

        this.results$ = this._dataService.getGazetteList(this.params);
      })
  }

  getResults(): void {
    this._router
      .navigate([], {
        queryParams: this.params.toObject(),
        queryParamsHandling: 'merge',
        relativeTo: this._route,
      })
      .then(() => {
        this._layout.scrollToElement('#content');
      });
  }


  searchByGazetteType(type: string) {
    const _params = new Params({
      page_size: 6,
      type,
    })
    this.params = _params;
    this.resumeMenuCollapsed = true;
    this.getResults();
  }

  getPage(page: number): void {
    this.params.page = page;
    this.getResults();
  }

  onFiltersChange(params: Params) {
    this.params = params;
    this.params.page = 1;
    this.getResults();
  }

  /*getResumeRange(start: number, end: number) {
    const gazzeteYears: any[] = [];
    let gazzeteTotals: number = 0;
    for (const year of range(start, end)) {
      const { types } = this.gazettesResume.find((e) => e.year == year);
      if (!gy) continue;
      gazzeteYears.push(...gy.types);
      const gt = gy?.types.map((t: any) => t.count).reduce((p: number, c: number) => p + c, 0);
      gazzeteTotals += gt || 0;
    }
    console.log({gazzeteYears, gazzeteTotals})
  }*/

  getGazetteResumeByRange(start: number, end: number) {
    const years = range(start, end);
    const _typesArray = years.map(e => this.getGazetteResumeByYear(e).types);
    const res: GazetteType[] = flatten(_typesArray, [])
    const types: GazetteType[] = [];
    for (const item of res) {
      const resIndex = types.findIndex(e => e.type == item.type);
      if (resIndex == -1) {
        const type = item.type;
        const count = item.count;
        types.push({ type, count });
      } else {
        const e = types[resIndex];
        e.count = e.count + item.count;
      }
    }
    const total = types.map(e => e.count).reduce((pv, nv) => pv + nv, 0);
    return {
      types,
      total
    }
  }

  getGazetteResumeByYear(year: number) {
    const { types } = this.gazettesResume.find(e => e.year === year) || { year, types: [] };
    const total = types.map(e => e.count).reduce((pv, cv) => pv + cv, 0);
    return {
      types,
      total
    }
  }

  getNormativeResumeByRange(start: number, end: number) {
    const years = range(start, end);
    const _typesArray = years.map(e => this.getNormativeResumeByYear(e).types);
    const res: NormativeType[] = flatten(_typesArray, [])
    const types: NormativeType[] = [];
    for (const item of res) {
      const resIndex = types.findIndex(e => e.normtype == item.normtype);
      if (resIndex == -1) {
        const normtype = item.normtype;
        const count = item.count;
        types.push({ normtype, count });
      } else {
        const e = types[resIndex];
        e.count = e.count + item.count;
      }
    }
    const total = types.map(e => e.count).reduce((pv, nv) => pv + nv, 0);
    return {
      types,
      total
    }
  }

  getNormativeResumeByYear(year: number) {
    const { types } = this.normativesResume.find(e => e.year === year) || { year, types: [] };
    const total = types.map(e => e.count).reduce((pv, cv) => pv + cv, 0);
    return {
      types,
      total
    }
  }
}
