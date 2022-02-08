import { InfographicDetailComponent } from './infographic-detail/infographic-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { InfographicsComponent } from './infographics.component';

const routes: Routes = [
  {
    path: '',
    component: InfographicsComponent
  },
  {
    path: ':id',
    component: InfographicDetailComponent
  }
];

export const InfographicsRoutes = RouterModule.forChild(routes);
