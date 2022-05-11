import { AdvancedSearchResolver } from './advanced-search.resolver';
import { AdvancedSearchComponent } from './advanced-search.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdvancedSearchComponent,
    resolve: { data: AdvancedSearchResolver },
    data: { title: 'Búsqueda avanzada' },
  },
];

export const AdvancedSearchRoutes = RouterModule.forChild(routes);
