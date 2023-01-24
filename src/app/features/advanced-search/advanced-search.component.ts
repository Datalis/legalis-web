import { ApiService } from '@app/@shared/services/api.service';
import { Params } from '../../@shared/model/params';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  slideYearSelected = 2009;
  slideMinYear = 2009;
  slideMaxYear = new Date().getFullYear();

  sliderOpts = {
    floor: this.slideMinYear,
    ceil: this.slideMaxYear,
  };

  searchText = '';

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

  get topThematics() {
    return this.thematics.sort((a,b) => b.count - a.count).slice(0,15);
  }

  constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.params.search_field = 'text';

    const [states, thematics, organisms] = this.route.snapshot.data.data;

    this.states = states;
    this.thematics = thematics;
    this.organisms = organisms;

    /*forkJoin([this._dataService.getNormativeStates(), this._dataService.getNormativeThematics(), this._dataService.getNormativeOrganisms()])
      .pipe(untilDestroyed(this))
      .subscribe(([states, thematics, organisms]) => {
        this.states = states;
        this.thematics = thematics;
        this.organisms = organisms;
        this.isLoading = false;
      });*/
  }

  reset(): void {
    this.params = new Params();
    this.params.search_field = 'text';
  }

  search(): void {
    this.router.navigate(['/busqueda'], {
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
