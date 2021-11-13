import { Routes, RouterModule } from '@angular/router';
import { GazettesComponent } from './gazettes.component';

const routes: Routes = [{ path: '', component: GazettesComponent }];

export const GazettesRoutes = RouterModule.forChild(routes);
