import { Shell } from './shell/shell.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  // Lazy load modules
  Shell.childRoutes([
    {
      path: 'busqueda-avanzada',
      loadChildren: () =>
        import('./features/advanced-search/advanced-search.module').then((m) => m.AdvancedSearchModule),
    },
  ]),
  // Shell.childRoutes([
  //   {
  //     path: 'directorio-tematico',
  //     loadChildren: () =>
  //       import('./features/thematic-directory/thematic-directory.module').then((m) => m.ThematicDirectoryModule),
  //     data: {
  //       title: 'Directorio Temático',
  //     },
  //   },
  // ]),
  Shell.childRoutes([
    {
      path: 'palabras-claves',
      loadChildren: () => import('./features/keywords/keywords.module').then((m) => m.KeywordsModule),
    },
  ]),
  Shell.childRoutes([
    {
      path: 'como-buscar',
      loadChildren: () => import('./features/how-to-search/how-to-search.module').then((m) => m.HowToSearchModule),
    },
  ]),
  // Shell.childRoutes([
  //   {
  //     path: 'analisis',
  //     loadChildren: () => import('./features/analysis/analysis.module').then((m) => m.AnalysisModule),
  //   },
  // ]),
  Shell.childRoutes([
    {
      path: 'consultas',
      loadChildren: () => import('./features/analysis/analysis.module').then((m) => m.AnalysisModule),
    },
  ]),
  Shell.childRoutes([
    {
      path: 'glosario',
      loadChildren: () => import('./features/glossary/glossary.module').then((m) => m.GlossaryModule),
    },
  ]),
  // Shell.childRoutes([
  //   {
  //     path: 'infografias',
  //     loadChildren: () => import('./features/infographics/infographics.module').then((m) => m.InfographicsModule),
  //   },
  // ]),
  Shell.childRoutes([
    {
      path: 'normativa',
      loadChildren: () => import('./features/normative/normative.module').then((m) => m.NormativeModule),
    },
  ]),
  Shell.childRoutes([
    {
      path: 'gacetas',
      loadChildren: () => import('./features/gazettes/gazettes.module').then((m) => m.GazettesModule),
    },
  ]),
  Shell.childRoutes([
    {
      path: 'busqueda',
      loadChildren: () => import('./features/search-results/search-results.module').then((m) => m.SearchResultsModule),
    },
  ]),
  Shell.childRoutes([
    {
      path: 'acerca-de',
      loadChildren: () => import('./features/about/about.module').then((m) => m.AboutModule),
    },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled',
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
