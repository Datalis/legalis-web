import { LETTERS } from './../../@shared/utils/data';
import { ApiService } from '@app/@shared/services/api.service';
import { LayoutService } from './../../@shared/services/layout.service';
import { Normative } from './../../@shared/model/normative';
import { Params } from '../../@shared/model/params';
import { ActivatedRoute, Router } from '@angular/router';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, forkJoin, combineLatest } from 'rxjs';
//import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { PagedResult } from '@app/@shared/model/paged-result';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NormativeState } from '@app/@shared/model/normative-state';
import { NormativeThematic } from '@app/@shared/model/normative-thematic';

@UntilDestroy()
@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss'],
})
export class KeywordsComponent implements OnInit {
  isLoading = true;

  params = new Params();

  states: NormativeState[] = [];
  thematics: NormativeThematic[] = [];

  letters: string[] = [];
  keywords: string[] = [];
  organisms: string[] = [];

  results?: PagedResult<Normative>;

  currentKeyword: string | null = null;
  currentLetter = 'A';
  currentOrder: null | '-year' = null;

  get currentKeywords() {
    return this.keywords.filter((k) => k.toLowerCase().startsWith(this.currentLetter.toLowerCase()));
  }

  currentLetter$ = new BehaviorSubject(this.currentLetter);

  constructor(
    //private _dataService: DataService,
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _layoutService: LayoutService
  ) {}

  ngOnInit() {
    const [states, thematics, keywords, organisms] = this._route.snapshot.data.data;

    this.states = states;
    this.thematics = thematics;
    this.keywords = keywords;
    this.organisms = organisms;

    this.letters = LETTERS;

    this._route.queryParams
      .pipe(
        untilDestroyed(this),
        map((params) => Params.fromObject(params))
      )
      .subscribe(async (params) => {
        this.currentKeyword = params.keyword ? decodeURIComponent(params.keyword) : null;
        this.currentOrder = params.ordering == '-year' ? '-year' : null;

        if (this.currentKeyword) {
          this.params = params;
          this.params.page_size = 5;
          this.results = undefined;
          this.results = await this._apiService.findNormatives(params);
        } else {
          this.params.keyword = this.currentKeywords[0];
          this._router.navigate([], {
            queryParams: this.params.toObject(),
            queryParamsHandling: 'merge',
            replaceUrl: true,
            relativeTo: this._route,
          });
        }
      });
  }

  onOrderChange(): void {
    this.params.ordering = this.currentOrder;
    this.getResults();
  }

  onKeywordChange(keyword: string) {
    this.params.keyword = keyword;
    this.getResults();
  }

  onLetterChange(letter: string) {
    this.currentLetter = letter;
    this.currentLetter$.next(this.currentLetter);
  }

  onFiltersChange(params: Params) {
    this.params = params;
    this.getResults();
  }

  getPage(page: number) {
    this.params.page = page;
    this.getResults();
  }

  getResults(): void {
    this._router
      .navigate([], {
        queryParams: this.params.toObject(),
        queryParamsHandling: 'merge',
        relativeTo: this._route,
      })
      .then(() => this._layoutService.scrollToElement('#content'));
  }
}
