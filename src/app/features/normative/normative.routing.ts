import { Routes, RouterModule } from '@angular/router';
import { NormativeComponent } from './normative.component';

const routes: Routes = [{ path: ':id', component: NormativeComponent }];

export const NormativeRoutes = RouterModule.forChild(routes);
