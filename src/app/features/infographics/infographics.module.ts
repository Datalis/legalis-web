import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { InfographicDetailComponent } from './infographic-detail/infographic-detail.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfographicsComponent } from './infographics.component';
import { SharedModule } from '@app/@shared';
import { InfographicsRoutes } from './infographics.routing';
import { NgxImageGalleryModule } from 'ngx-image-gallery';

@NgModule({
  imports: [CommonModule, SharedModule, NgxImageGalleryModule, NgScrollbarModule, InfographicsRoutes],
  declarations: [InfographicsComponent, InfographicDetailComponent],
})
export class InfographicsModule {}
