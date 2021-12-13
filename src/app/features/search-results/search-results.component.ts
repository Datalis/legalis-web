import { DataService } from '@app/@shared/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResult } from './../../@shared/model/search-result';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  results$?: Observable<SearchResult>;
  normativesStates$?: Observable<string[]>;

  subscriptions: Subscription[] = [];

  constructor(private _dataService: DataService, private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    this.normativesStates$ = this._dataService.getNormativeStates();
    this.subscriptions.push(
      this._route.queryParams.subscribe((params) => {
        const query = params?.query;
        if (!query) {
          // No query. Navigate to home.
          this._router.navigateByUrl('/');
        }
        this.results$ = this._dataService.getSearchResults(query);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
