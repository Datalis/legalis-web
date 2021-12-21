import { LayoutService } from './../../@shared/services/layout.service';
import { Filters } from '@app/@shared/model/filters';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Gazette } from '@app/@shared/model/gazette';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FiltersComponent } from '@app/@shared/components/filters/filters.component';

@UntilDestroy()
@Component({
  selector: 'app-gazettes',
  templateUrl: './gazettes.component.html',
  styleUrls: ['./gazettes.component.scss'],
})
export class GazettesComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage = 10;

  gazettes$?: Observable<PagedResult<Gazette>>;

  thematics: string[] = [];
  types: string[] = [];

  filters = new Filters();

  @ViewChild('filterMobile', { read: FiltersComponent }) filterMobile?: FiltersComponent;

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _layout: LayoutService
  ) {}

  ngOnInit() {
    combineLatest([
      this._dataService.getNormativeThematics(),
      this._dataService.getGazetteTypes(),
      this._route.queryParams,
    ])
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.thematics = res[0] || [];
        this.types = res[1] || [];
        const { type, thematic, page, year, year_gte, year_lte } = res[2];

        this.filters.type = type ? decodeURIComponent(type) : null;
        this.filters.thematic = thematic ? decodeURIComponent(thematic) : null;
        this.filters.year = year ? +year : null;
        this.filters.year_gte = year_gte ? +year : null;
        this.filters.year_lte = year_lte ? +year_lte : null;

        this.currentPage = page ? +page : 1;

        this.gazettes$ = this._dataService.getGazettes(
          this.filters.type,
          this.filters.year,
          this.filters.year_gte,
          this.filters.year_lte,
          this.filters.thematic,
          this.currentPage,
          this.itemsPerPage
        );
      });
  }

  getPage(page: number) {
    this.currentPage = page;
    this._router
      .navigate([], {
        queryParams: { page: this.currentPage },
        relativeTo: this._route,
        queryParamsHandling: 'merge',
      })
      .then(() => {
        //this._layout.scrollToItem("gazetteResults");
        this.filterMobile && (this.filterMobile.showCollapsed = true);
        this._layout.scrollToTop();
      });
  }

  onFiltersChange(filters: Filters) {
    this.filters = filters;
    this._router
      .navigate([], {
        queryParams: {
          type: filters.type ? encodeURIComponent(filters.type) : null,
          organism: filters.organism ? encodeURIComponent(filters.organism) : null,
          thematic: filters.thematic ? encodeURIComponent(filters.thematic) : null,
          year: filters.year,
          year_gte: filters.year_gte,
          year_lte: filters.year_lte,
          page: null, // reset paging on filters change as it may lead to non existing pages.
        },
        relativeTo: this._route,
        queryParamsHandling: 'merge',
      })
      .then(() => {
        this._layout.scrollToItem('gazetteResults');
      });
  }
}
