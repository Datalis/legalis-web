import { HttpResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerComponent } from './../pdf-viewer/pdf-viewer.component';
import { DataService } from '@app/@shared/services/data.service';
import { Gazette } from '@app/@shared/model/gazette';
import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-gazette-item',
  templateUrl: './gazette-item.component.html',
  styleUrls: ['./gazette-item.component.scss']
})
export class GazetteItemComponent implements OnInit {

  @Input() item!: Gazette;

  contentCollapsed = false;

  constructor(
    private _dataService: DataService,
    private _modal: NgbModal
  ) { }

  ngOnInit() {
  }

  showGazettePdf(file: any) {
    const url = `https://api-gaceta.datalis.dev/files/${file}`;
    this._dataService
      .downloadFile(url)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this._modal.open(PdfViewerComponent, {
          centered: true,
          size: 'xl',
          scrollable: true,
          backdrop: 'static',
        }).componentInstance.pdfFile = res.body;
      });
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
