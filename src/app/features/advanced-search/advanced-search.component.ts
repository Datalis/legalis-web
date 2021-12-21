import { removeEmpty } from './../../@shared/utils/helpers';
import { Filters } from './../../@shared/model/filters';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  slideYearSelected = 2010;
  slideMinYear = 1990;
  slideMaxYear = new Date().getFullYear();

  sliderOpts = {
    floor: this.slideMinYear,
    ceil: this.slideMaxYear,
  };

  get years(): number[] {
    const _res: number[] = [];
    for (let i = this.slideMinYear; i <= this.slideMaxYear; i++) {
      _res.push(i);
    }
    return _res;
  }

  loading = false;

  normativeStates: string[] = [];
  normativeThematics: string[] = [];

  filters: Filters = new Filters();

  constructor(private _dataService: DataService, private _router: Router) {}

  ngOnInit() {
    this.loading = true;
    combineLatest([this._dataService.getNormativeStates(), this._dataService.getNormativeThematics()])
      .pipe(
        untilDestroyed(this),
        catchError((e) => {
          this.loading = false;
          return throwError(e);
        })
      )
      .subscribe((res) => {
        this.normativeStates = res[0];
        this.normativeThematics = res[1];
        this.loading = false;
      });
  }

  reset(): void {
    this.filters = new Filters();
  }

  search(): void {
    let params = removeEmpty(this.filters);
    Object.keys(params).forEach((k) => {
      params[k] = encodeURIComponent(params[k]);
    });
    this._router.navigate(['/search'], {
      queryParams: {
        ...params,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSliderHighValueChange(value: number) {
    this.filters.year_lte = value;
  }

  onSliderValueChange(value: number) {
    this.filters.year_gte = value;
  }
}
