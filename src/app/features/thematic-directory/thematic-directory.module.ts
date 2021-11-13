import { ThematicDirectoryRoutes } from './thematic-directory.routing';
import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThematicDirectoryComponent } from './thematic-directory.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbAccordionModule,
    AngularSvgIconModule.forRoot(),
    NgxPaginationModule,
    ThematicDirectoryRoutes,
  ],
  declarations: [ThematicDirectoryComponent],
})
export class ThematicDirectoryModule {}
