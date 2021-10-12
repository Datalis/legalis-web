import { Routes, RouterModule } from '@angular/router';
import { GlossaryComponent } from './glossary.component';

const routes: Routes = [{ path: '', component: GlossaryComponent }];

export const GlossaryRoutes = RouterModule.forChild(routes);
