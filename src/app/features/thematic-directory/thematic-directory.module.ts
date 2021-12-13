import { ThematicDirectoryRoutes } from './thematic-directory.routing';
import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThematicDirectoryComponent } from './thematic-directory.component';
import { NgbAccordionModule, NgbCollapse, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { DirectoryItemComponent } from './directory-item/directory-item.component';
import { DirectoryMenuComponent } from './directory-menu/directory-menu.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbAccordionModule,
    NgbCollapseModule,
    AngularSvgIconModule.forRoot(),
    NgxPaginationModule,
    ThematicDirectoryRoutes,
  ],
  declarations: [ThematicDirectoryComponent, DirectoryMenuComponent, DirectoryItemComponent],
})
export class ThematicDirectoryModule {}
