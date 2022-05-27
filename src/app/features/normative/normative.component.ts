import { ApiService } from '@app/@shared/services/api.service';
import { switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Normative } from '@app/@shared/model/normative';
import { Observable } from 'rxjs';
import { Gazette } from '@app/@shared/model/gazette';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerComponent } from '@app/@shared/components/pdf-viewer/pdf-viewer.component';
import { HttpResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { PDFDocument } from 'pdf-lib';
import { range } from '@app/@shared';

@UntilDestroy()
@Component({
  selector: 'app-normative',
  templateUrl: './normative.component.html',
  styleUrls: ['./normative.component.scss'],
})
export class NormativeComponent implements OnInit {
  normative?: Normative;
  gazette?: Gazette;

  isLoading = false;

  constructor(
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _modal: NgbModal,
    private _title: Title
  ) {}

  async ngOnInit() {
    const [normative, gazette] = this._route.snapshot.data.data;

    this.normative = normative;
    if (gazette) {
      this.gazette = gazette;
    }

    this.setPageTitle(this.normative?.name || '');
  }

  setPageTitle(name: string) {
    this._title.setTitle(`Legalis - ${name}`);
  }

  isActive(item: any): boolean {
    return item.state == 'Activa' || item.state == 'Vigente';
  }

  showGazettePdf(file: any, startpage?: number) {
    const modalRef = this._modal.open(PdfViewerComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
      backdrop: 'static',
    });
    modalRef.shown.toPromise().then(() => {
      const viewer: PdfViewerComponent = modalRef.componentInstance;
      viewer.openPdf(file, startpage);
    });
  }

  downloadGazettePdf(id: any, file: any): Observable<HttpResponse<Blob>> {
    return this._apiService
      .downloadFile(`https://api-gaceta.datalis.dev/files/${file}`)
      .pipe(tap(async () => this._apiService.getGazette(id)));
  }

  downloadGazettePdfPages(id: any, file: any, startpage: number, endpage: number): Observable<HttpResponse<Blob>> {
    return this._apiService.downloadFile(`https://api-gaceta.datalis.dev/files/${file}`).pipe(
      switchMap(async (res) => {
        const arrayBuffer = await new Response(res.body).arrayBuffer();
        const readPdf = await PDFDocument.load(arrayBuffer);
        const writePdf = await PDFDocument.create();
        const pageRange = range(startpage, endpage);
        const writePages = await writePdf.copyPages(readPdf, pageRange);
        writePages.forEach((p) => writePdf.addPage(p));
        const bytes = await writePdf.save();
        const blob = new Blob([bytes]);
        return new HttpResponse({
          body: blob,
          headers: res.headers,
          status: res.status,
          statusText: res.statusText,
          url: res.url!,
        });
      })
    );
  }
}
