import { Routes, RouterModule } from '@angular/router';
import { GlossaryComponent } from './glossary.component';

const routes: Routes = [{ path: '', component: GlossaryComponent, data: { title: 'Glosario de términos' } }];

export const GlossaryRoutes = RouterModule.forChild(routes);
