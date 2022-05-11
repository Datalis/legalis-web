import { ApiService } from '@app/@shared/services/api.service';
import { Params } from '@app/@shared/model/params';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
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
  itemsPerPage = 6;

  results?: PagedResult<GlossaryTerm>;
  params: Params = new Params();

  constructor(private _apiService: ApiService, private _route: ActivatedRoute, private _router: Router) {}

  async ngOnInit() {
    this.letters = LETTERS;

    this._route.queryParams.pipe(untilDestroyed(this)).subscribe(async (params) => {
      this.params.page = params.page;
      this.params.page_size = this.itemsPerPage;
      this.params.startswith = params.startswith || this.defaultLetter;

      const results = await this._apiService.getGlossaryTerms(this.params);
      this.results = results;
    });

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

  onLetterChange(letter: string) {
    this.params.startswith = letter;
    this.params.page = 1;
    this.getResults();
  }

  onPageChange(page: number) {
    this.params.page = page;
    this.getResults();
  }

  getResults(): void {
    this._router.navigate([], {
      queryParams: this.params.toObject(),
      queryParamsHandling: 'merge',
      relativeTo: this._route,
    });
  }
}
