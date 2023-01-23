import { ApiService } from '@app/@shared/services/api.service';
import { Params } from '@app/@shared/model/params';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import { PagedResult } from './../../@shared/model/paged-result';
//import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { GlossaryTerm } from '@app/@shared/model/glossary-term';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LETTERS } from '@app/@shared/utils/data';

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
    this.termsCount+=30;
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
      ).subscribe((res) => {
        this.results = res;
        console.log(res);
      })
  }

  async ngOnInit() {


    // this._route.queryParams.pipe(untilDestroyed(this)).subscribe(async (params) => {
    //   // this.params.page = params.page;
    //   // this.params.page_size = this.itemsPerPage;
    //   this.params.startswith = params.startswith || this.defaultLetter;

    //   const results = await this._apiService.getGlossaryTerms(this.params);
    //   this.results = results;
    // });



    //this.letters = this._dataService.letters;
    /*this._route.queryParams
      .pipe(
        tap(() => (this.isLoading = true)),
        map((params) => Params.fromObject(params)),
        switchMap((params) => {
          this.params.page = params.page;
          this.params.page_size = this.itemsPerPage;
          this.params.startswith = params.startswith || this.defaultLetter;
          return this._dataService.getGlossaryTerms(this.params);
        })
      )
      .subscribe((res) => {
        //this.results = res;
        this.isLoading = false;
      });*/
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
    inputRef.value = ""
    this.params.search = null;
    this.params.startswith = this.defaultLetter;
    this.termCollapsed = -1;
    this.getResults();
  }

  onSearchTerm(e: any) {
    let term = e.target.value;
    this.params.search = term;
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
