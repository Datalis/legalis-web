import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GazettesComponent } from './gazettes.component';
import { SharedModule } from '@app/@shared';
import { GazettesRoutes } from './gazettes.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, SharedModule, NgxPaginationModule, NgbModalModule, GazettesRoutes],
  declarations: [GazettesComponent],
})
export class GazettesModule {}
