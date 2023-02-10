import { ApiService } from '@app/@shared/services/api.service';
import { Params } from '@app/@shared/model/params';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PagedResult } from './../../@shared/model/paged-result';
//import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { GlossaryTerm } from '@app/@shared/model/glossary-term';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LETTERS } from '@app/@shared/utils/data';
import deburr from 'lodash.deburr';

@UntilDestroy()
@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss'],
})
export class GlossaryComponent implements OnInit {
  letters: string[] = [];
  defaultLetter = 'A';
  // itemsPerPage = 6;

  results?: PagedResult<GlossaryTerm>;

  params: Params = new Params();

  termCollapsed: number | null | undefined = -1;

  showRefs = false;

  references$: Observable<any>;

  termsCount = 40;

  get results$(): GlossaryTerm[] {
    return this.results?.results?.slice(0, this.termsCount) || [];
  }

  loadMore() {
    this.termsCount += 30;
  }

  constructor(private _apiService: ApiService, private _route: ActivatedRoute, private _router: Router) {
    this.references$ = this._apiService.getGlossaryRefs({});
    this.letters = LETTERS;
    this._route.queryParams
      .pipe(
        untilDestroyed(this),
        switchMap((params) => {
          this.params.startswith = params.startswith;
          return this._apiService.getGlossaryTerms({ ...params, page_size: 10000 });
        })
      )
      .subscribe((res) => {
        this.results = res;
        // console.log(res);
      });
  }

  async ngOnInit() {
    
  }

  openRefs() {
    this.showRefs = true;
    this.params.startswith = null;
  }

  splitResults(data: any[]) {
    let half = Math.ceil(data.length / 2);
    let left = data.slice(0, half);
    let right = data.slice(half);
    return [left, right];
  }

  trackItems(_index: number, e: any) {
    return e.id;
  }

  resetSearch(inputRef: HTMLInputElement) {
    inputRef.value = '';
    this.params.search = null;
    this.params.startswith = this.defaultLetter;
    this.termCollapsed = -1;
    this.getResults();
  }

  onSearchTerm(e: any) {
    let term = e.target.value;
    this.params.search = deburr(term);
    this.params.startswith = null;
    this.termCollapsed = -1;
    this.showRefs = false;
    this.termsCount = 40;
    this.getResults();
  }

  onLetterChange(letter: string) {
    this.params.startswith = letter;
    this.params.search = null;
    this.termCollapsed = -1;
    this.showRefs = false;
    this.termsCount = 40;
    this.getResults();
  }

  // onPageChange(page: number) {
  //   this.params.page = page;
  //   this.getResults();
  // }

  getResults(): void {
    this._router.navigate([], {
      queryParams: this.params.toObject(),
      queryParamsHandling: 'merge',
      relativeTo: this._route,
    });
  }
}
