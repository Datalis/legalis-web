import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KeywordsRoutes } from './keywords.routing';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordsComponent } from './keywords.component';

@NgModule({
  imports: [CommonModule, SharedModule, NgbModule, NgScrollbarModule, FormsModule, NgxPaginationModule, KeywordsRoutes],
  declarations: [KeywordsComponent],
})
export class KeywordsModule {}
