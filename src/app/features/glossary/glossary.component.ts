import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { PagedResult } from './../../@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { GlossaryTerm } from '@app/@shared/model/glossary-term';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss'],
})
export class GlossaryComponent implements OnInit {
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

  currentLetter = 'A';
  currentPage = 1;

  itemsPerPage = 6;

  results$?: Observable<PagedResult<GlossaryTerm>>;

  results = [];

  constructor(private _dataService: DataService, private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    this.results$ = this._route.queryParams.pipe(
      map((params) => params.page || 1),
      tap((page) => (this.currentPage = page)),
      switchMap((page) => this._dataService.getGlossaryTerms(page, this.itemsPerPage))
    );
  }

  getPage(page: number) {
    this.currentPage = page;
    /*this._router.navigate([], {
      queryParams: { page: this.currentPage },
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });*/
  }
}
