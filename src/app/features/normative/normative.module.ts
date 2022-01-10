import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NormativeComponent } from './normative.component';
import { SharedModule } from '@app/@shared';
import { NormativeRoutes } from './normative.routing';
import { FileSaverModule } from 'ngx-filesaver';

@NgModule({
  imports: [CommonModule, SharedModule, FileSaverModule, NormativeRoutes],
  declarations: [NormativeComponent],
})
export class NormativeModule {}
