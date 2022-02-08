import { Routes, RouterModule } from '@angular/router';
import { HowToSearchComponent } from './how-to-search.component';

const routes: Routes = [
  {
    path: '',
    component: HowToSearchComponent,
  },
];

export const HowToSearchRoutes = RouterModule.forChild(routes);
