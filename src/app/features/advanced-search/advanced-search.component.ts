import { Params } from '../../@shared/model/params';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { throwError, Observable, forkJoin } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  slideYearSelected = 1990;
  slideMinYear = 1990;
  slideMaxYear = new Date().getFullYear();

  sliderOpts = {
    floor: this.slideMinYear,
    ceil: this.slideMaxYear,
  };

  isLoading = true;
  searchText = "";

  get years(): number[] {
    const _res: number[] = [];
    for (let i = this.slideMinYear; i <= this.slideMaxYear; i++) {
      _res.push(i);
    }
    return _res;
  }

  states: any[] = [];
  thematics: any[] = [];
  organisms: any[] = [];

  params: Params = new Params();

  constructor(private _dataService: DataService, private _router: Router) { }

  ngOnInit() {
    this.params.search_field = 'text';
    forkJoin([this._dataService.getNormativeStates(), this._dataService.getNormativeThematics(), this._dataService.getNormativeOrganisms()])
      .pipe(untilDestroyed(this))
      .subscribe(([states, thematics, organisms]) => {
        this.states = states;
        this.thematics = thematics;
        this.organisms = organisms;
        this.isLoading = false;
      });
  }

  reset(): void {
    this.params = new Params();
    this.params.search_field = 'text';
  }

  search(): void {
    this._router.navigate(['/search'], {
      queryParams: this.params.toObject(),
      queryParamsHandling: 'merge',
    });
  }

  onYearChanged(): void {
    this.params.year_gte = null;
    this.params.year_lte = null;
  }

  onSliderHighValueChange(value: number) {
    this.params.year_lte = value;
  }

  onSliderValueChange(value: number) {
    this.params.year_gte = value;
    //this.params.year = value;
  }

  setExactWordsSearch(words: string) {
    this.params.text = `"${words}"`;
  }

  setSomeWordsSearch(words: string) {
    this.params.text = words;
  }
}
