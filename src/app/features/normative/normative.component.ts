import { LayoutService } from './../../@shared/services/layout.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Normative } from '@app/@shared/model/normative';
import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-normative',
  templateUrl: './normative.component.html',
  styleUrls: ['./normative.component.scss'],
})
export class NormativeComponent implements OnInit, AfterViewInit {
  normative$?: Observable<Normative>;

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _layoutService: LayoutService
  ) {}

  ngOnInit() {
    const id = this._route.snapshot.params?.id;
    id && (this.normative$ = this._dataService.getNormativeById(id));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._layoutService.scrollToTop();
    }, 1);
  }

  isActive(item: any): boolean {
    return item.state == 'Activa' || item.state == 'Vigente';
  }
}
