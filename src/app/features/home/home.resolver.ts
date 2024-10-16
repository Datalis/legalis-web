import { ApiService } from '@app/@shared/services/api.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeResolver implements Resolve<any> {
  // popularNormativesYear = 2021;

  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return Promise.all([
      this.apiService.findNormatives({
        year_gte: 2009,
        ordering: '-read_count',
        // year: new Date().getFullYear(),
      }),
      this.apiService.findGazettes({ page_size: 1, page: 1 }),
      this.apiService.relatedNews(),
      this.apiService.getInfographics(),
      this.apiService.consultasJuridicas(100)
    ]);
  }
}
