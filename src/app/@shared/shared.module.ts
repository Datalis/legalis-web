import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { EmptyResultsComponent } from './components/empty-results/empty-results.component';
import { NgbCollapse, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
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
    LottieModule.forRoot({ player: playerFactory }),
  ],
  declarations: [
    LoaderComponent,
    FiltersComponent,
    NormativeItemComponent,
    EmptyResultsComponent,
    PdfViewerComponent,
    HighlightPipe,
  ],
  exports: [LoaderComponent, FiltersComponent, NormativeItemComponent, EmptyResultsComponent, HighlightPipe],
})
export class SharedModule {}
