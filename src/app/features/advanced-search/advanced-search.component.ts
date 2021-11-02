import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  minValue = 2010;

  sliderOpts = {
    floor: 1990,
    ceil: this.maxValue,
  };

  get maxValue(): number {
    return new Date().getFullYear();
  }

  constructor() {}

  ngOnInit() {}
}
