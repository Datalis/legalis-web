import { AdvancedSearchComponent } from './advanced-search.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: AdvancedSearchComponent }];

export const AdvancedSearchRoutes = RouterModule.forChild(routes);
