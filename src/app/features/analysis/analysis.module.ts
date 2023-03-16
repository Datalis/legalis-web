import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { SharedModule } from '@app/@shared';
import { AnalysisRoutes } from './analysis.routing';
import { AnalysisDetailComponent } from './analysis-detail/analysis-detail.component';

@NgModule({
  imports: [CommonModule, SharedModule, AnalysisRoutes],
  declarations: [AnalysisComponent, AnalysisDetailComponent],
})
export class AnalysisModule {}
