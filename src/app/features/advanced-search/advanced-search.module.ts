import { AdvancedSearchRoutes } from './advanced-search.routing';
import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedSearchComponent } from './advanced-search.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  imports: [CommonModule, SharedModule, NgxSliderModule, AdvancedSearchRoutes],
  declarations: [AdvancedSearchComponent],
})
export class AdvancedSearchModule {}
