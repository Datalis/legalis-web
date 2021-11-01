import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';

@NgModule({
  imports: [CommonModule, TranslateModule, IvyCarouselModule, SharedModule, HomeRoutingModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
