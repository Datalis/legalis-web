import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Normative } from '@app/@shared/model/normative';
import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-normative',
  templateUrl: './normative.component.html',
  styleUrls: ['./normative.component.scss'],
})
export class NormativeComponent implements OnInit {
  normative$?: Observable<Normative>;

  constructor(private _dataService: DataService, private _route: ActivatedRoute) {}

  ngOnInit() {
    const id = this._route.snapshot.params?.id;
    id && (this.normative$ = this._dataService.getNormativeById(id));
  }

  isActive(item: any): boolean {
    return item.state == 'Activa' || item.state == 'Vigente';
  }
}
