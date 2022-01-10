import { LayoutService } from './../../services/layout.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Params } from '@app/@shared/model/params';
import { ScreenSizeService } from '@app/@shared/services/screen-size.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Options } from '@angular-slider/ngx-slider';

@UntilDestroy()
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input() params: Params = new Params();
  @Output() paramsChange = new EventEmitter();

  showCollapsed: boolean = false;

  @Input() states: any[] = [];
  @Input() thematics: any[] = [];
  @Input() gazetteTypes: any[] = [];
  @Input() organisms: any[] = [];

  @Input() slideYearSelected = 1990;
  @Input() slideMinYear = 1990;
  @Input() slideMaxYear = new Date().getFullYear();
  @Input() years = this._years;

  @Input() showState = true;
  @Input() showOrganism = true;
  @Input() showYear = true;
  @Input() showGazetteType = false;
  @Input() showThematics = true;

  sliderOpts: Options = {
    floor: this.slideMinYear,
    ceil: this.slideMaxYear,
    step: 1,
  };

  paramsChange$ = new Subject();

  private get _years(): number[] {
    const _res: number[] = [];
    for (let i = this.slideMinYear; i <= this.slideMaxYear; i++) {
      _res.push(i);
    }
    return _res;
  }

  constructor(private _layoutService: LayoutService) {
    this.paramsChange$.pipe(debounceTime(400)).subscribe(() => {
      this.paramsChange.emit(this.params);
    });
  }

  ngOnInit(): void {
    this._layoutService.isSmallScreen$.pipe(untilDestroyed(this)).subscribe((small) => {
      this.showCollapsed = small;
    });
  }

  ngOnDestroy(): void {
    this.paramsChange$.unsubscribe();
  }

  onYearChanged(year: any): void {
    this.params.year_gte = null;
    this.params.year_lte = null;
    this.params.year = year;
    this.paramsChange$.next();
  }

  onSliderHighValueChange(value: number) {
    this.params.year = null;
    this.params.year_lte = value;
    this.paramsChange$.next();
  }

  onSliderValueChange(value: number) {
    this.params.year = null;
    this.params.year_gte = value;
    this.paramsChange$.next();
  }

  reset(): void {
    this.params = new Params();
    this.paramsChange$.next();
  }
}
