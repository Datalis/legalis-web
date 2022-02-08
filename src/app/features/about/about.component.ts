import { Observable } from 'rxjs';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  version: string | null = environment.version;

  results$?: Observable<PagedResult<any>>;

  constructor(private _dataService: DataService) {
    this.results$ = this._dataService.getAboutUsInfo();
  }

  ngOnInit() {}
}
