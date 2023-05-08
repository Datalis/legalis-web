import { BehaviorSubject, Subject } from 'rxjs';
//import { DataService } from '@app/@shared/services/data.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '@env/environment';
@UntilDestroy()
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
  @ViewChild('pdfViewer') pdfViewer?: PdfJsViewerComponent;

  pdfSrc: string = '';
  isReady = false;

  get filename() {
    return this.pdfSrc;
  }

  get fileUrl() {
    return `${environment.serverUrl}/files/${this.pdfSrc}`;
  }

  constructor(
    private _modal: NgbActiveModal,
    //sprivate _dataService: DataService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {}

  onDocumentLoad() {
    console.log('loaded');
  }

  openPdf(pdf: string, startpage?: number): void {
    this.pdfSrc = pdf;
    if (this.pdfViewer) {
      this.ngZone.runOutsideAngular(() => {
        this.pdfViewer!!.pdfSrc = this.fileUrl;
        if (startpage) {
          this.pdfViewer!!.page = startpage;
        }
        this.pdfViewer!!.refresh();
      });
    } else {
      console.error('PdfViewer not yet initialized');
    }
    //this.pdfViewer && (this.pdfViewer.pdfSrc = this.fileUrl);
    /*this._dataService.downloadFile(this.fileUrl)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.pdfFile = res.body as Blob;
        this.pdfViewer && (this.pdfViewer.pdfSrc = this.pdfFile);
        this.pdfViewer && (this.pdfViewer!!.refresh());
    })*/
  }

  close() {
    this._modal.close();
  }
}
