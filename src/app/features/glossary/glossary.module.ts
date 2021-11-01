import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlossaryComponent } from './glossary.component';
import { SharedModule } from '@app/@shared';
import { GlossaryRoutes } from './glossary.routing';

@NgModule({
  imports: [CommonModule, SharedModule, GlossaryRoutes],
  declarations: [GlossaryComponent],
})
export class GlossaryModule {}
