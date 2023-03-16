import { Routes, RouterModule } from '@angular/router';
import { AnalysisDetailComponent } from './analysis-detail/analysis-detail.component';
import { AnalysisDetailResolver } from './analysis-detail/analysis-detail.resolver';
import { AnalysisComponent } from './analysis.component';
import { AnalysisResolver } from './analysis.resolver';

const routes: Routes = [
  {
    path: '',
    component: AnalysisComponent,
    data: { title: 'Consultas Frecuentes' },
    resolve: { data: AnalysisResolver },
  },
  {
    path: ':id',
    runGuardsAndResolvers: "paramsChange",
    component: AnalysisDetailComponent,
    data: { title: 'Consultas Frecuentes' },
    resolve: { data:  AnalysisDetailResolver }
  },
];

export const AnalysisRoutes = RouterModule.forChild(routes);
