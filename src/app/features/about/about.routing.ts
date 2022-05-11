import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from '@app/shell/shell.service';
import { AboutComponent } from './about.component';
import { AboutResolver } from './about.resolver';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    resolve: { aboutDetails: AboutResolver },
    data: { title: 'Acerca de' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AboutRoutingModule {}
