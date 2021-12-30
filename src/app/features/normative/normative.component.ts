import { switchMap } from 'rxjs/operators';
import { LayoutService } from './../../@shared/services/layout.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Normative } from '@app/@shared/model/normative';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, EMPTY } from 'rxjs';
import { Gazette } from '@app/@shared/model/gazette';

@Component({
  selector: 'app-normative',
  templateUrl: './normative.component.html',
  styleUrls: ['./normative.component.scss'],
})
export class NormativeComponent implements OnInit, AfterViewInit {
  normative$?: Observable<Normative>;
  gazette$?: Observable<Gazette>;

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _layoutService: LayoutService
  ) {}

  ngOnInit() {
    const id = this._route.snapshot.params?.id;
    this.normative$ = this._dataService.getNormativeById(id);
    this.gazette$ = this.normative$.pipe(
      switchMap((n) => (n.gazette ? this._dataService.getGazetteById(n.gazette) : EMPTY))
    );
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
