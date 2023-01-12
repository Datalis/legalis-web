import { Routes, RouterModule } from '@angular/router';
import { AnalysisComponent } from './analysis.component';

const routes: Routes = [{ path: '', component: AnalysisComponent, data: { title: 'Consultas Frecuentes' } }];

export const AnalysisRoutes = RouterModule.forChild(routes);
