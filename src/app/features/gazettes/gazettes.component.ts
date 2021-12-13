import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Gazette } from '@app/@shared/model/gazette';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-gazettes',
  templateUrl: './gazettes.component.html',
  styleUrls: ['./gazettes.component.scss'],
})
export class GazettesComponent implements OnInit, OnDestroy {
  currentPage: number = 1;

  gazettes$?: Observable<PagedResult<Gazette>>;
  normativeStates$?: Observable<string[]>;
  normativeKeywords$?: Observable<string[]>;

  normativesByGazette$?: Observable<PagedResult<Normative>>;

  subscriptions: Subscription[] = [];

  constructor(private _dataService: DataService, private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    this.normativeStates$ = this._dataService.getNormativeStates();
    this.subscriptions.push(
      this._route.queryParams.subscribe((params) => {
        const page = params?.page || this.currentPage;
        this.gazettes$ = this._dataService.getGazettes(page);
      })
    );
  }

  getPage(page: number) {
    this.currentPage = page;
    this._router.navigate([], {
      queryParams: { page: this.currentPage },
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
