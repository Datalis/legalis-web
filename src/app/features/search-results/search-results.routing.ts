import { SearchResultsComponent } from './search-results.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: SearchResultsComponent }];

export const SearchResultsRoutes = RouterModule.forChild(routes);
