import { PagedResult } from './../../@shared/model/paged-result';
import { debounceTime, catchError, finalize } from 'rxjs/operators';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, forkJoin, throwError, combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResult } from './../../@shared/model/search-result';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Filters } from '@app/@shared/model/filters';

@UntilDestroy()
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  results$?: Observable<PagedResult<SearchResult>>;

  normativeStates: any[] = [];
  normativeThematics: any[] = [];
  loading = false;
  error = false;

  filters: Filters = new Filters();

  currentPage = 1;
  itemsPerPage = 4;

  currentSearchQuery: string = '';

  constructor(private _dataService: DataService, private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    this.loading = true;
    combineLatest([
      this._dataService.getNormativeStates(),
      this._dataService.getNormativeThematics(),
      this._route.queryParams,
    ])
      .pipe(
        untilDestroyed(this),
        catchError((e) => {
          this.loading = false;
          this.error = true;
          return throwError(e);
        })
      )
      .subscribe((res) => {
        this.normativeStates = res[0] || [];
        this.normativeThematics = res[1] || [];

        this.loading = false;

        const params = res[2];

        const { q, page, state, year, year_gte, year_lte, keyword, organism, search_field, thematic } = params;

        this.filters.keyword = keyword ? decodeURIComponent(keyword) : null;
        this.filters.organism = organism ? decodeURIComponent(organism) : null;
        this.filters.state = state ? decodeURIComponent(state) : null;
        this.filters.year = year ? +year : null;
        this.filters.year_gte = year_gte ? +year_gte : null;
        this.filters.year_lte = year_lte ? +year_lte : null;
        this.filters.search_field = search_field || null;
        this.filters.thematic = thematic ? decodeURIComponent(thematic) : null;

        this.currentSearchQuery = q ? decodeURIComponent(q) : '';
        this.currentPage = page ? +page : 1;

        this.results$ = this._dataService.getSearchResults(
          this.currentSearchQuery,
          this.filters.year,
          this.filters.year_gte,
          this.filters.year_lte,
          this.filters.state,
          this.filters.keyword,
          this.filters.organism,
          this.filters.thematic,
          this.currentPage,
          this.itemsPerPage
        );
      });
  }

  onFiltersChange(filters: Filters) {
    this.filters = filters;
    this._router.navigate([], {
      queryParams: {
        state: filters.state ? encodeURIComponent(filters.state) : null,
        organism: filters.organism ? encodeURIComponent(filters.organism) : null,
        keyword: filters.keyword ? encodeURIComponent(filters.keyword) : null,
        thematic: filters.thematic ? encodeURIComponent(filters.thematic) : null,
        year: filters.year,
        year_gte: filters.year_gte,
        year_lte: filters.year_lte,
        page: null, // reset paging on filters change as it may lead to non existing pages.
      },
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }

  getPage(page: number) {
    this.currentPage = page;
    this._router.navigate([], {
      queryParams: { page: this.currentPage },
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }
}
