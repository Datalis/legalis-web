import { ApiService } from '@app/@shared/services/api.service';
import { Normative } from '@app/@shared/model/normative';
import { LayoutService } from './../../@shared/services/layout.service';
import { PagedResult } from './../../@shared/model/paged-result';
import { map } from 'rxjs/operators';
//import { DataService } from '@app/@shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Params } from '@app/@shared/model/params';
import { Title } from '@angular/platform-browser';

@UntilDestroy()
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  results?: PagedResult<Normative>;

  states: any[] = [];
  thematics: any[] = [];
  organisms: any[] = [];
  isLoading = true;

  params = new Params();

  currentSearchQuery: string = '';

  sortByYear = false;

  constructor(
    //private _dataService: DataService,
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _layoutService: LayoutService,
    private _title: Title
  ) {}

  setPageTitle(query: string) {
    this._title.setTitle(`Legalis - Resultados de búsqueda para "${query}"`);
  }

  ngOnInit() {
    const [states, thematics, organisms] = this._route.snapshot.data.data;
    this.states = states;
    this.thematics = thematics;
    this.organisms = organisms;

    this._route.queryParams
      .pipe(
        untilDestroyed(this),
        map((params) => Params.fromObject(params))
      )
      .subscribe(async (params) => {
        this.setPageTitle(params.text!);
        this.params = params;
        this.params.page_size = 5;
        this.currentSearchQuery = decodeURIComponent(this.params.text || '');
        this.sortByYear = new Boolean(this.params.sort_by_year).valueOf() || false;
        this.results = undefined;
        this.results = await this._apiService.search(this.params);
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
        this._layoutService.scrollToElement('#content');
      });
  }

  onFiltersChange(params: Params) {
    this.params = params;
    this.params.page = 1;
    this.getResults();
  }

  onOrderChange(): void {
    //this.params.ordering = this.currentOrder;
    this.params.sort_by_year = this.sortByYear || null;
    this.getResults();
  }

  getPage(page: number) {
    this.params.page = page;
    this.getResults();
  }
}
