import { Normative } from './../../@shared/model/normative';
import { Filters } from './../../@shared/model/filters';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResult } from './../../@shared/model/search-result';
import { map, catchError } from 'rxjs/operators';
import { Observable, combineLatest, throwError } from 'rxjs';
import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { PagedResult } from '@app/@shared/model/paged-result';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss'],
})
export class KeywordsComponent implements OnInit {
  hideFilters = true;

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
    'N',
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

  normativeStates: string[] = [];
  normativeThematics: string[] = [];
  keywords: string[] = [];
  currentKeywords: any[] = [];
  currentKeyword?: string;
  currentLetter = 'A';
  currentPage = 1;

  itemsPerPage = 2;

  loading = false;
  error = false;

  filters: Filters = new Filters();

  $results?: Observable<PagedResult<Normative>>;

  constructor(private _dataService: DataService, private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    this.loading = true;
    combineLatest([
      this._dataService.getNormativeStates(),
      this._dataService.getNormativeThematics(),
      this._dataService.getNormativeKeywords(),
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
        this.keywords = res[2] || [];
        this.currentKeywords = this.keywords.filter((e) => e.startsWith(this.currentLetter));
        this.loading = false;

        const params = res[3] || {};
        const { page, keyword, state, organism, year, year_gte, year_lte } = params;

        this.currentPage = page ? +page : 1;

        this.currentKeyword = keyword ? decodeURIComponent(keyword) : undefined;

        if (!this.currentKeyword) {
          this.currentKeyword = this.currentKeywords[0];
        }

        this.filters.keyword = this.currentKeyword || null;
        this.filters.organism = organism ? decodeURIComponent(organism) : null;
        this.filters.state = state ? decodeURIComponent(state) : null;
        this.filters.year = year ? +year : null;
        this.filters.year_gte = year_gte ? +year_gte : null;
        this.filters.year_lte = year_lte ? +year_lte : null;

        this.$results = this._dataService.getNormatives(
          this.filters.year,
          this.filters.year_gte,
          this.filters.year_lte,
          this.filters.state,
          this.filters.keyword,
          this.filters.organism,
          this.currentPage,
          this.itemsPerPage
        );
      });
  }

  onKeywordSelected(keyword: string) {
    this._router.navigate([], {
      queryParams: {
        keyword: encodeURIComponent(keyword),
        page: null, // Reset paging
      },
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

  setCurrentLetter(item: string) {
    this.currentLetter = item;
    this.currentKeywords = this.keywords.filter((e) => e.startsWith(this.currentLetter));
  }
}
