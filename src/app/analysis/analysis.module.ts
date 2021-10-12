import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { SharedModule } from '@app/@shared';
import { AnalysisRoutes } from './analysis.routing';

@NgModule({
  imports: [CommonModule, SharedModule, AnalysisRoutes],
  declarations: [AnalysisComponent],
})
export class AnalysisModule {}
