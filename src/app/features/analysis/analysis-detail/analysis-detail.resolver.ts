import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ApiService } from "@app/@shared/services/api.service";

@Injectable({
    providedIn: 'root'
})
export class AnalysisDetailResolver implements Resolve<any> {

    constructor(private _apiService: ApiService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = route.params.id;
        return Promise.all([
            this._apiService.consultaDetail(id),
            this._apiService.consultasJuridicas(100),
        ]);
    }
}