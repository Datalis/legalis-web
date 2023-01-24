import { GazetteType } from './../../model/gazette-type';
import { NormativeThematic } from './../../model/normative-thematic';
import { LayoutService } from './../../services/layout.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Params } from '@app/@shared/model/params';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Options } from '@angular-slider/ngx-slider';
import { NormativeState } from '@app/@shared/model/normative-state';

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

  @Input() states: NormativeState[] = [];
  @Input() thematics: NormativeThematic[] = [];
  @Input() gazetteTypes: GazetteType[] = [];
  @Input() organisms: string[] = [];

  @Input() slideYearSelected = 1990;
  @Input() slideMinYear = 1990;
  @Input() slideMaxYear = new Date().getFullYear();
  @Input() years = this._years;

  @Input() showState = true;
  @Input() showOrganism = true;
  @Input() showYear = true;
  @Input() showGazetteType = false;
  @Input() showThematics = true;

  @Input() allowUnsetYear = true;

  // sliderOpts: Options = {
  //   floor: this.slideMinYear,
  //   ceil: this.slideMaxYear,
  //   step: 1,
  // };

  get sliderOpts$() {
    return {
      floor: this.slideMinYear,
      ceil: this.slideMaxYear,
      step: 1,
    }
  }

  paramsChange$ = new Subject<void>();

  private get _years(): number[] {
    const _res: number[] = [];
    for (let i = this.slideMinYear; i <= this.slideMaxYear; i++) {
      _res.push(i);
    }
    return _res;
  }

  get topThematics() {
    return this.thematics.sort((a,b) => b.count - a.count).slice(0,15);
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
    this.params.year_lte = value;
    this.paramsChange$.next();
  }

  onSliderValueChange(value: number) {
    this.params.year_gte = value;
    this.paramsChange$.next();
  }

  reset(): void {
    this.params = new Params();
    this.paramsChange$.next();
  }
}
