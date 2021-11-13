import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NormativeComponent } from './normative.component';
import { SharedModule } from '@app/@shared';
import { NormativeRoutes } from './normative.routing';

@NgModule({
  imports: [CommonModule, SharedModule, NormativeRoutes],
  declarations: [NormativeComponent],
})
export class NormativeModule {}
