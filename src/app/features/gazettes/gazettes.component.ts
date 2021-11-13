import { Component, OnInit } from '@angular/core';
import { Gazette } from '@app/@shared/model/gazette';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gazettes',
  templateUrl: './gazettes.component.html',
  styleUrls: ['./gazettes.component.scss'],
})
export class GazettesComponent implements OnInit {
  currentPage: number = 0;

  gazettes$?: Observable<PagedResult<Gazette>>;
  normativesByGazette$?: Observable<PagedResult<Normative>>;

  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this.gazettes$ = this._dataService.getGazettes();
  }
}
