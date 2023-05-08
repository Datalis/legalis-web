import { ApiService } from '@app/@shared/services/api.service';
import { HttpResponse } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerComponent } from './../pdf-viewer/pdf-viewer.component';
//import { DataService } from '@app/@shared/services/data.service';
import { Gazette } from '@app/@shared/model/gazette';
import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { from, Observable } from 'rxjs';
import { environment } from '@env/environment';

@UntilDestroy()
@Component({
  selector: 'app-gazette-item',
  templateUrl: './gazette-item.component.html',
  styleUrls: ['./gazette-item.component.scss'],
})
export class GazetteItemComponent implements OnInit {
  @Input() item!: Gazette;

  contentCollapsed = false;

  constructor(private _apiService: ApiService, private _modal: NgbModal) {}

  ngOnInit() {}

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
    });
  }

  downloadGazettePdf(id: any, file: any): Observable<HttpResponse<Blob>> {
    return this._apiService
      .downloadFile(`${environment.serverUrl}/files/${file}`)
      .pipe(tap(async () => this._apiService.getGazette(id)));
  }
}
