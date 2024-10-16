import { ApiService } from "@app/@shared/services/api.service";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NormativeResolver implements Resolve<any> {
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const slug = route.params.slug;
    if (!slug) {
      this.router.navigateByUrl("/");
      return Promise.reject();
    }
    return this.apiService.getNormative(slug).then((normative) => {
      if (slug !== normative.slug) {
        this.router.navigateByUrl(`/normativa/${normative.slug}`, {
          replaceUrl: true,
        });
        return Promise.reject();
      }
      const gazette = !!normative.gazette
        ? this.apiService.getGazette(normative.gazette)
        : Promise.resolve(null);
      console.log(slug, normative.slug)
      return Promise.all([Promise.resolve(normative), gazette]);
    });
  }
}
