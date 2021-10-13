import { FooterComponent } from './footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';

@NgModule({
  imports: [CommonModule, TranslateModule, NgbModule, IvyCarouselModule, I18nModule, RouterModule],
  declarations: [HeaderComponent, FooterComponent, ShellComponent],
})
export class ShellModule {}
