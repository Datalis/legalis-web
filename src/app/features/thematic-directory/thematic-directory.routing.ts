import { ThematicDirectoryComponent } from './thematic-directory.component';
import { Routes, RouterModule } from '@angular/router';
import { ThematicDirectoryResolver } from './thematic-directory.resolver';

const routes: Routes = [
  {
    path: '**',
    component: ThematicDirectoryComponent,
    data: { title: 'Directorio Temático' },
    resolve: { directories: ThematicDirectoryResolver },
  },
];

export const ThematicDirectoryRoutes = RouterModule.forChild(routes);
