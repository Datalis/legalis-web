import { ApiService } from '@app/@shared/services/api.service';
import { tap } from 'rxjs/operators';
import { LayoutService } from './../../@shared/services/layout.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Normative } from '@app/@shared/model/normative';
//import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';
import { Gazette } from '@app/@shared/model/gazette';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerComponent } from '@app/@shared/components/pdf-viewer/pdf-viewer.component';
import { HttpResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

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
      .downloadFile(`https://api-gaceta.datalis.dev/files/${file}`)
      .pipe(tap(async () => this._apiService.getGazette(id)));
  }
}
