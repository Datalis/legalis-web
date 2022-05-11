import { Routes, RouterModule } from '@angular/router';
import { GazettesComponent } from './gazettes.component';
import { GazettesResolver } from './gazettes.resolver';

const routes: Routes = [
  {
    path: '',
    component: GazettesComponent,
    resolve: { data: GazettesResolver },
    data: { title: 'Índice de gacetas' },
  },
];

export const GazettesRoutes = RouterModule.forChild(routes);
