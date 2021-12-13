import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from './search-results.component';
import { SearchResultsRoutes } from './search-results.routing';

@NgModule({
  imports: [CommonModule, SharedModule, NgxPaginationModule, SearchResultsRoutes],
  declarations: [SearchResultsComponent],
})
export class SearchResultsModule {}
