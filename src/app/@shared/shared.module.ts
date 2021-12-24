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
    LottieModule.forRoot({ player: playerFactory }),
  ],
  declarations: [LoaderComponent, FiltersComponent, NormativeItemComponent, EmptyResultsComponent, HighlightPipe],
  exports: [LoaderComponent, FiltersComponent, NormativeItemComponent, EmptyResultsComponent, HighlightPipe],
})
export class SharedModule {}
