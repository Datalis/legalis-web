import { Routes, RouterModule } from '@angular/router';
import { AnalysisComponent } from './analysis.component';

const routes: Routes = [{ path: '', component: AnalysisComponent }];

export const AnalysisRoutes = RouterModule.forChild(routes);
