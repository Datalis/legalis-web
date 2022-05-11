import { Routes, RouterModule } from '@angular/router';
import { HowToSearchComponent } from './how-to-search.component';

const routes: Routes = [
  {
    path: '',
    component: HowToSearchComponent,
    data: { title: 'Cómo buscar' },
  },
];

export const HowToSearchRoutes = RouterModule.forChild(routes);
