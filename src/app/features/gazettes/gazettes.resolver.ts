import { ApiService } from '@app/@shared/services/api.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GazettesResolver implements Resolve<any> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return Promise.all([
      this.apiService.getNormativeThematics(),
      this.apiService.getNormativeResume(),
      this.apiService.getNormativeOrganisms(),
      this.apiService.getGazetteResume(),
      this.apiService.getGazetteTypes(),
    ]);
  }
}
