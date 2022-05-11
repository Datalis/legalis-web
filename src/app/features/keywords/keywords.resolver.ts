import { ApiService } from '@app/@shared/services/api.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeywordsResolver implements Resolve<any> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return Promise.all([
      this.apiService.getNormativeStates(),
      this.apiService.getNormativeThematics(),
      this.apiService.getNormativeKeywords(),
      this.apiService.getNormativeOrganisms(),
    ]);
  }
}
