import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit, OnChanges {
  @ViewChild('pdfViewer') pdfViewer?: any;

  @Input() pdfFile?: Blob;

  constructor(private _modal: NgbActiveModal) {}

  ngOnInit() {}

  close() {
    this._modal.close();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
