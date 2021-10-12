import { Routes, RouterModule } from '@angular/router';
import { InfographicsComponent } from './infographics.component';

const routes: Routes = [{ path: '', component: InfographicsComponent }];

export const InfographicsRoutes = RouterModule.forChild(routes);
