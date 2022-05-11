import { SearchResultsComponent } from './search-results.component';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultsResolver } from './search-results.resolver';

const routes: Routes = [
  {
    path: '',
    component: SearchResultsComponent,
    resolve: { data: SearchResultsResolver },
  },
];

export const SearchResultsRoutes = RouterModule.forChild(routes);
