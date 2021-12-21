import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Filters } from '@app/@shared/model/filters';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  @Input()
  filters: Filters = new Filters();
  filtersChange$ = new Subject();

  @Input()
  showCollapsed = true;

  @Input() states: any[] = [];
  @Input() thematics: any[] = [];
  @Input() gazetteTypes: any[] = [];

  @Input() slideYearSelected = 2010;
  @Input() slideMinYear = 1990;
  @Input() slideMaxYear = new Date().getFullYear();
  @Input() years = this._years;

  @Input() showState = true;
  @Input() showOrganism = true;
  @Input() showYear = true;
  @Input() showGazetteType = false;
  @Input() showThematics = true;

  sliderOpts = {
    floor: this.slideMinYear,
    ceil: this.slideMaxYear,
  };

  private get _years(): number[] {
    const _res: number[] = [];
    for (let i = this.slideMinYear; i <= this.slideMaxYear; i++) {
      _res.push(i);
    }
    return _res;
  }

  @Output()
  filtersChange = new EventEmitter();

  constructor(private _router: Router) {
    this.filtersChange$.pipe(debounceTime(400)).subscribe((res) => this.filtersChange.emit(res));
  }

  ngOnInit() {}

  onFiltersChange(): void {
    this.filtersChange$.next(this.filters);
  }

  onSliderHighValueChange(value: any) {
    this.filters.year_lte = value;
    this.filtersChange$.next(this.filters);
  }

  onSliderValueChange(value: any) {
    this.filters.year_gte = value;
    this.filtersChange$.next(this.filters);
  }
}
