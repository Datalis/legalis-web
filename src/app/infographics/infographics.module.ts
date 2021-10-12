import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfographicsComponent } from './infographics.component';
import { SharedModule } from '@app/@shared';
import { InfographicsRoutes } from './infographics.routing';

@NgModule({
  imports: [CommonModule, SharedModule, InfographicsRoutes],
  declarations: [InfographicsComponent],
})
export class InfographicsModule {}
