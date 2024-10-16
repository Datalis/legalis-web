import { Routes, RouterModule } from "@angular/router";
import { NormativeComponent } from "./normative.component";
import { NormativeResolver } from "./normative.resolver";

const routes: Routes = [
  {
    path: ":slug",
    component: NormativeComponent,
    resolve: { data: NormativeResolver },
  },
];

export const NormativeRoutes = RouterModule.forChild(routes);
