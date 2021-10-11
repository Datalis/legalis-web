import { KeywordsRoutes } from './keywords.routing';
import { SharedModule } from './../@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordsComponent } from './keywords.component';

@NgModule({
  imports: [CommonModule, SharedModule, KeywordsRoutes],
  declarations: [KeywordsComponent],
})
export class KeywordsModule {}
