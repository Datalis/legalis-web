import { KeywordsComponent } from './keywords.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: KeywordsComponent }];

export const KeywordsRoutes = RouterModule.forChild(routes);
