import { DecodeUriPipe } from './pipe/decode-uri.pipe';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FileSaverModule } from 'ngx-filesaver';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { EmptyResultsComponent } from './components/empty-results/empty-results.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NormativeItemComponent } from './components/normative-item/normative-item.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FiltersComponent } from './components/filters/filters.component';
import { HighlightPipe } from './pipe/highlight.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from './components/loader/loader.component';
import { LottieModule } from 'ngx-lottie';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { GazetteItemComponent } from './components/gazette-item/gazette-item.component';
import { ShareBtnComponent } from './components/share-btn/share-btn.component';
import { PopupComponent } from './components/popup/popup.component';

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web/build/player/lottie_light');
}

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    RouterModule,
    NgxSliderModule,
    NgSelectModule,
    PdfJsViewerModule,
    FileSaverModule,
    NgScrollbarModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
  declarations: [
    LoaderComponent,
    FiltersComponent,
    NormativeItemComponent,
    GazetteItemComponent,
    EmptyResultsComponent,
    PdfViewerComponent,
    HighlightPipe,
    DecodeUriPipe,
    ShareBtnComponent,
    PopupComponent,
  ],
  exports: [
    LoaderComponent,
    FiltersComponent,
    NormativeItemComponent,
    GazetteItemComponent,
    EmptyResultsComponent,
    ShareBtnComponent,
    PopupComponent,
    HighlightPipe,
    DecodeUriPipe,
  ],
})
export class SharedModule {}
