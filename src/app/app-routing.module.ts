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
  Shell.childRoutes([
    {
      path: 'how-to-search',
      loadChildren: () => import('./how-to-search/how-to-search.module').then((m) => m.HowToSearchModule),
    },
  ]),
  Shell.childRoutes([
    { path: 'analysis', loadChildren: () => import('./analysis/analysis.module').then((m) => m.AnalysisModule) },
  ]),
  Shell.childRoutes([
    { path: 'glossary', loadChildren: () => import('./glossary/glossary.module').then((m) => m.GlossaryModule) },
  ]),
  Shell.childRoutes([
    {
      path: 'infographics',
      loadChildren: () => import('./infographics/infographics.module').then((m) => m.InfographicsModule),
    },
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
