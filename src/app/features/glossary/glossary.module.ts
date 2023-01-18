import { NgxPaginationModule } from 'ngx-pagination';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlossaryComponent } from './glossary.component';
import { SharedModule } from '@app/@shared';
import { GlossaryRoutes } from './glossary.routing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, SharedModule, NgxPaginationModule, GlossaryRoutes, NgbCollapseModule],
  declarations: [GlossaryComponent],
})
export class GlossaryModule {}
