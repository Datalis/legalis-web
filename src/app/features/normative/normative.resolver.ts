import { ApiService } from '@app/@shared/services/api.service';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NormativeResolver implements Resolve<any> {
  constructor(private apiService: ApiService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params.id;
    if (!id) {
      this.router.navigateByUrl('/');
      return Promise.reject();
    } else {
      return this.apiService.getNormative(id).then((normative) => {
        const gazette = !!normative.gazette ? this.apiService.getGazette(normative.gazette) : Promise.resolve(null);
        return Promise.all([Promise.resolve(normative), gazette]);
      });
    }
  }
}
