import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { LayoutService } from './../../@shared/services/layout.service';
import { Params } from '@app/@shared/model/params';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Gazette } from '@app/@shared/model/gazette';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, Subscription, combineLatest, forkJoin, throwError, EMPTY } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FiltersComponent } from '@app/@shared/components/filters/filters.component';

@UntilDestroy()
@Component({
  selector: 'app-gazettes',
  templateUrl: './gazettes.component.html',
  styleUrls: ['./gazettes.component.scss'],
})
export class GazettesComponent implements OnInit {
  isLoading = true;

  thematics: string[] = [];
  types: string[] = [];
  organisms: string[] = [];
  gazettesResume: any[] = [];
  normativesResume: any[] = [];

  params = new Params();

  results$?: Observable<PagedResult<Gazette> | null>;

  @ViewChild('filterMobile', { read: FiltersComponent }) filterMobile?: FiltersComponent;

  get resume() {
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
  }

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _layout: LayoutService
  ) {}

  ngOnInit() {
    combineLatest([
      this._dataService.getThematics(),
      this._dataService.getGazettesResume(),
      this._dataService.getNormativesResume(),
      this._dataService.getOrganisms(),
      this._dataService.gazetteTypes$,
      this._route.queryParams.pipe(map((params) => Params.fromObject(params))),
    ])
      .pipe(
        untilDestroyed(this),
        catchError((e) => {
          this.isLoading = false;
          return throwError(e);
        })
      )
      .subscribe(([thematics, gazetteResume, normativesResume, organisms, types, params]) => {
        this.thematics = thematics || [];
        this.types = types || [];
        this.organisms = organisms || [];
        this.gazettesResume = gazetteResume || [];
        this.normativesResume = normativesResume || [];
        this.params = params;
        this.params.page_size = 10;
        this.results$ = this._dataService.getGazettes(params);
        this.isLoading = false;
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
        this._layout.scrollToItem('content');
      });
  }

  downloadGazette(id: string) {
    this._dataService
      .getGazetteById(id)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        const url = `https://api-gaceta.datalis.dev/files/${res.file}`;
        this._dataService
          .downloadFile(url)
          .pipe(untilDestroyed(this))
          .subscribe((data) => {
            const fileUrl = URL.createObjectURL(data);
            window.open(fileUrl, '_blank');
          });
      });
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
}
