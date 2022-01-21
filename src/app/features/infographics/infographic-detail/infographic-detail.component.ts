import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Infographic } from '@app/@shared/model/infographic';

@Component({
  selector: 'app-infographic-detail',
  templateUrl: './infographic-detail.component.html',
  styleUrls: ['./infographic-detail.component.scss']
})
export class InfographicDetailComponent implements OnInit {

  result$?: Observable<Infographic>;

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this._route.snapshot.params.id;
    this.result$ = this._dataService.getInfographic(id);
  }

}
