import { ApiService } from "@app/@shared/services/api.service";
import { switchMap, tap } from "rxjs/operators";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Normative } from "@app/@shared/model/normative";
import { EMPTY, Observable, throwError } from "rxjs";
import { Gazette } from "@app/@shared/model/gazette";
import { UntilDestroy } from "@ngneat/until-destroy";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PdfViewerComponent } from "@app/@shared/components/pdf-viewer/pdf-viewer.component";
import { HttpResponse } from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
import { PDFDocument } from "pdf-lib";
import { range } from "@app/@shared";
import { environment } from "@env/environment";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";

@UntilDestroy()
@Component({
  selector: "app-normative",
  templateUrl: "./normative.component.html",
  styleUrls: ["./normative.component.scss"],
})
export class NormativeComponent implements OnInit {
  normative?: Normative;
  gazette?: Gazette;

  isLoading = false;

  constructor(
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _modal: NgbModal,
    private _title: Title,
    private _meta: Meta,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private _doc: Document,
  ) {}

  async ngOnInit() {
    const [normative, gazette] = this._route.snapshot.data.data;

    this.normative = normative;
    if (gazette) {
      this.gazette = gazette;
    }

    this.setPageTitle(this.normative?.name || "");

    const _schema = this.getSchema(normative, gazette);

    const _script = this._doc.createElement("script");
    _script.setAttribute("type", "application/ld+json");
    _script.innerHTML = JSON.stringify(_schema);
    this._doc.head.appendChild(_script);

    this._meta.updateTag({
      name: "description",
      content: this.normative?.summary ?? "",
    });
    let link: HTMLLinkElement = this._doc.createElement("link");
    link.setAttribute("rel", "canonical");
    this._doc.head.appendChild(link);
    link.setAttribute("href", this._doc.URL);
  }

  getSchema(normative: Normative, gazette: Gazette) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Legislation",
      name: normative.name,
      legislationIdentifier: `${normative.number}/${normative.year}`,
      legislationDate: gazette.date,
      legislationType: {
        "@type": "CategoryCode",
        name: normative.normtype,
        inCodeSet: {
          "@type": "CategoryCodeSet",
          name: "Tipos de legislación",
        },
      },
      jurisdiction: {
        "@type": "AdministrativeArea",
        name: "Cuba",
      },
      // text: "https://example.com/ley-de-proteccion-de-datos-personales",
      text: `https://legalis.eltoque.com/normativa/${normative.slug}`,
      // subject: normative.summary,
    };

    return schema;

    // const _json = JSON.stringify(schema, null, 2).replace(
    //   /<\/script>/g,
    //   "<\\/script>",
    // );
    // let _html: string | SafeHtml =
    //   `<script type="application/ld+json">${_json}</script>`;
    // _html = this.sanitizer.bypassSecurityTrustHtml(_html as string);
    // return _html;
  }

  setPageTitle(name: string) {
    this._title.setTitle(`Legalis - ${name}`);
  }

  isActive(item: any): boolean {
    return item.state == "Activa" || item.state == "Vigente";
  }

  showGazettePdf(file: any, startpage?: number) {
    const modalRef = this._modal.open(PdfViewerComponent, {
      centered: true,
      size: "xl",
      scrollable: true,
      backdrop: "static",
    });
    modalRef.shown.toPromise().then(() => {
      const viewer: PdfViewerComponent = modalRef.componentInstance;
      viewer.openPdf(file, startpage);
    });
  }

  downloadGazettePdf(id: any, file: any): Observable<HttpResponse<Blob>> {
    return this._apiService
      .downloadFile(`${environment.serverUrl}/files/${file}`)
      .pipe(tap(async () => this._apiService.getGazette(id)));
  }

  downloadGazettePdfPages(
    id: any,
    file: any,
    startpage: number,
    endpage: number,
  ): Observable<HttpResponse<Blob> | any> {
    return this._apiService
      .downloadFile(`${environment.serverUrl}/files/${file}`)
      .pipe(
        switchMap(async (res) => {
          try {
            const arrayBuffer = await new Response(res.body).arrayBuffer();
            const readPdf = await PDFDocument.load(arrayBuffer);
            const writePdf = await PDFDocument.create();
            const pageRange = range(startpage - 1, endpage - 1);
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
          } catch (e) {
            console.error(e);
            return EMPTY;
          }
        }),
      );
  }
}
