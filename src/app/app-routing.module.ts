import { Shell } from './shell/shell.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // Lazy load modules
  Shell.childRoutes([
    {
      path: 'advanced-search',
      loadChildren: () => import('./advanced-search/advanced-search.module').then((m) => m.AdvancedSearchModule),
    },
  ]),
  Shell.childRoutes([
    {
      path: 'thematic-directory',
      loadChildren: () =>
        import('./thematic-directory/thematic-directory.module').then((m) => m.ThematicDirectoryModule),
    },
  ]),
  Shell.childRoutes([
    { path: 'keywords', loadChildren: () => import('./keywords/keywords.module').then((m) => m.KeywordsModule) },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
