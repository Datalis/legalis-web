import { Routes, RouterModule } from "@angular/router";
import { NormativeComponent } from "./normative.component";
import { NormativeResolver } from "./normative.resolver";

const routes: Routes = [
  // {
  //   path: ":id",
  //   component: NormativeComponent,
  //   resolve: { data: NormativeResolver },
  // },
  {
    path: ":slug",
    component: NormativeComponent,
    resolve: { data: NormativeResolver },
  },
];

export const NormativeRoutes = RouterModule.forChild(routes);
