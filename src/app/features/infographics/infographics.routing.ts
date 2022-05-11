import { InfographicDetailComponent } from './infographic-detail/infographic-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { InfographicsComponent } from './infographics.component';
import { InfographicsResolver } from './infographics.resolver';
import { InfographicResolver } from './infographic-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: InfographicsComponent,
    resolve: { data: InfographicsResolver },
    data: { title: 'Infografías' },
  },
  {
    path: ':id',
    component: InfographicDetailComponent,
    resolve: { data: InfographicResolver },
    data: { title: 'Infografía' },
  },
];

export const InfographicsRoutes = RouterModule.forChild(routes);
