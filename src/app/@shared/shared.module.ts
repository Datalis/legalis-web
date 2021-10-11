import { IvyCarouselModule } from 'angular-responsive-carousel';
import { RecentComponent } from './components/recent/recent.component';
import { PopularComponent } from './components/popular/popular.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [TranslateModule, CommonModule, IvyCarouselModule],
  declarations: [LoaderComponent, PopularComponent, RecentComponent],
  exports: [LoaderComponent, PopularComponent, RecentComponent],
})
export class SharedModule {}
