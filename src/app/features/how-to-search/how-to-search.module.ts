import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowToSearchComponent } from './how-to-search.component';
import { SharedModule } from '@app/@shared';
import { HowToSearchRoutes } from './how-to-search.routing';

@NgModule({
  imports: [CommonModule, SharedModule, HowToSearchRoutes],
  declarations: [HowToSearchComponent],
})
export class HowToSearchModule {}
