import { AdvancedSearchRoutes } from './advanced-search.routing';
import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedSearchComponent } from './advanced-search.component';

@NgModule({
  imports: [CommonModule, SharedModule, AdvancedSearchRoutes],
  declarations: [AdvancedSearchComponent],
})
export class AdvancedSearchModule {}
