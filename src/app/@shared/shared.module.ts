import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from './components/loader/loader.component';
import { LottieModule } from 'ngx-lottie';

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web/build/player/lottie_light');
}

@NgModule({
  imports: [TranslateModule, CommonModule, LottieModule.forRoot({ player: playerFactory })],
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
})
export class SharedModule {}
