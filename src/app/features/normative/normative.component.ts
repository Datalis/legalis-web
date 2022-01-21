import { mergeMap, switchMap, map } from 'rxjs/operators';
import { LayoutService } from './../../@shared/services/layout.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Normative } from '@app/@shared/model/normative';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, EMPTY, of } from 'rxjs';
import { Gazette } from '@app/@shared/model/gazette';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerComponent } from '@app/@shared/components/pdf-viewer/pdf-viewer.component';
import { HttpResponse } from '@angular/common/http';

@UntilDestroy()
@Component({
  selector: 'app-normative',
  templateUrl: './normative.component.html',
  styleUrls: ['./normative.component.scss'],
})
export class NormativeComponent implements OnInit, AfterViewInit {
  normative?: Normative;
  gazette?: Gazette;

  isLoading = false;

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _layoutService: LayoutService,
    private _modal: NgbModal
  ) {}

  ngOnInit() {
    const id = this._route.snapshot.params?.id;
    this.isLoading = true;
    this._dataService
      .getNormativeById(id)
      .pipe(
        switchMap((normative) =>
          this._dataService.getGazetteById(normative.gazette!!).pipe(
            map((gazzete) => {
              return { normative, gazzete };
            })
          )
        )
      )
      .subscribe((res) => {
        this.normative = res.normative;
        this.gazette = res.gazzete;
        this.isLoading = false;
      });
  }

  ngAfterViewInit(): void {
    /*setTimeout(() => {
      this._layoutService.scrollToTop();
    }, 1);*/
  }

  isActive(item: any): boolean {
    return item.state == 'Activa' || item.state == 'Vigente';
  }

  showGazettePdf(file: any) {
    const modalRef = this._modal.open(PdfViewerComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
      backdrop: 'static',
    });
    modalRef.shown.toPromise().then(() => {
      const viewer: PdfViewerComponent = modalRef.componentInstance;
      viewer.openPdf(file);
    })
    /*this._dataService
      .downloadFile(url)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this._modal.open(PdfViewerComponent, {
          centered: true,
          size: 'xl',
          scrollable: true,
          backdrop: 'static',
        }).componentInstance.pdfFile = res.body;
      });*/
  }

  downloadGazettePdf(id: any, file: any): Observable<HttpResponse<Blob>> {
    return this._dataService.getGazetteById(id).pipe(
      switchMap(() => {
        const url = `https://api-gaceta.datalis.dev/files/${file}`;
        return this._dataService.downloadFile(url);
      })
    );
  }
}
