import { KeywordsComponent } from './keywords.component';
import { Routes, RouterModule } from '@angular/router';
import { KeywordsResolver } from './keywords.resolver';

const routes: Routes = [
  {
    path: '',
    component: KeywordsComponent,
    resolve: { data: KeywordsResolver },
    data: { title: 'Palabra Clave' },
  },
];

export const KeywordsRoutes = RouterModule.forChild(routes);
