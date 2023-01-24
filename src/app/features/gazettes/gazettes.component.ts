import { ApiService } from '@app/@shared/services/api.service';
import { GazetteType } from './../../@shared/model/gazette-type';
import { NormativeThematic } from './../../@shared/model/normative-thematic';
import { LayoutService } from './../../@shared/services/layout.service';
import { Params } from '@app/@shared/model/params';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Gazette } from '@app/@shared/model/gazette';
import { PagedResult } from '@app/@shared/model/paged-result';
//import { DataService } from '@app/@shared/services/data.service';
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

  normativeThematics: NormativeThematic[] = [];
  normativeOrganisms: string[] = [];
  normativeResume: NormativeResume[] = [];

  gazetteResume: GazetteResume[] = [];
  gazetteTypes: GazetteType[] = [];

  params = new Params({
    page_size: 5,
    //year: 2021
  });

  resume: any = null;
  resumeMenuCollapsed = true;

  results?: PagedResult<Gazette>;

  minYear = 2009;
  maxYear = new Date().getFullYear();

  @ViewChild('filterMobile', { read: FiltersComponent }) filterMobile?: FiltersComponent;

  constructor(
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _layout: LayoutService
  ) {}

  ngOnInit() {
    const [thematics, normResume, organisms, gazetteResume, gazetteTypes] = this._route.snapshot.data.data;
    this.normativeThematics = thematics;
    this.normativeResume = normResume;
    this.normativeOrganisms = organisms;
    this.gazetteResume = gazetteResume;
    this.gazetteTypes = gazetteTypes;

    this._route.queryParams.pipe(untilDestroyed(this)).subscribe(async (params) => {
      this.params = new Params({
        ...this.params,
        ...params,
      });

      if (this.params.year) {
        this.resume = {
          year: this.params.year,
          normatives: this.getNormativeResumeByYear(this.params.year),
          gazettes: this.getGazetteResumeByYear(this.params.year),
        };
      } else if (this.params.year_gte && this.params.year_lte) {
        this.resume = {
          year: this.params.year_gte,
          year_end: this.params.year_lte,
          normatives: this.getNormativeResumeByRange(this.params.year_gte, this.params.year_lte),
          gazettes: this.getGazetteResumeByRange(this.params.year_gte, this.params.year_lte),
        };
      } else {
        this.resume = {
          year: this.minYear,
          year_end: this.maxYear,
          normatives: this.getNormativeResumeByRange(this.minYear, this.maxYear),
          gazettes: this.getGazetteResumeByRange(this.minYear, this.maxYear),
        };
      }

      this.results = await this._apiService.findGazettes(this.params);
    });
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
    });
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

  getGazetteResumeByRange(start: number, end: number) {
    const years = range(start, end);
    const _typesArray = years.map((e) => this.getGazetteResumeByYear(e).types);
    const res: GazetteType[] = flatten(_typesArray, []);
    const types: GazetteType[] = [];
    for (const item of res) {
      const resIndex = types.findIndex((e) => e.type == item.type);
      if (resIndex == -1) {
        const type = item.type;
        const count = item.count;
        types.push({ type, count });
      } else {
        const e = types[resIndex];
        e.count = e.count + item.count;
      }
    }
    const total = types.map((e) => e.count).reduce((pv, nv) => pv + nv, 0);
    return {
      types,
      total,
    };
  }

  getGazetteResumeByYear(year: number) {
    const { types } = this.gazetteResume.find((e) => e.year === year) || { year, types: [] };
    const total = types.map((e) => e.count).reduce((pv, cv) => pv + cv, 0);
    return {
      types,
      total,
    };
  }

  getNormativeResumeByRange(start: number, end: number) {
    const years = range(start, end);
    const _typesArray = years.map((e) => this.getNormativeResumeByYear(e).types);
    const res: NormativeType[] = flatten(_typesArray, []);
    const types: NormativeType[] = [];
    for (const item of res) {
      const resIndex = types.findIndex((e) => e.normtype == item.normtype);
      if (resIndex == -1) {
        const normtype = item.normtype;
        const count = item.count;
        types.push({ normtype, count });
      } else {
        const e = types[resIndex];
        e.count = e.count + item.count;
      }
    }
    const total = types.map((e) => e.count).reduce((pv, nv) => pv + nv, 0);
    return {
      types,
      total,
    };
  }

  getNormativeResumeByYear(year: number) {
    const { types } = this.normativeResume.find((e) => e.year === year) || { year, types: [] };
    const total = types.map((e) => e.count).reduce((pv, cv) => pv + cv, 0);
    return {
      types,
      total,
    };
  }
}
