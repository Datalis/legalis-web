import { ThematicDirectoryComponent } from './thematic-directory.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: ThematicDirectoryComponent }];

export const ThematicDirectoryRoutes = RouterModule.forChild(routes);
