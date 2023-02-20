import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/@shared/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {

  consultas: any[] | null = null;

  limit = 4;
  showMore = true;

  constructor(private _route: ActivatedRoute, private _router: Router,
    private _apiService: ApiService) {}

  ngOnInit() {
    const consultas = this._route.snapshot.data.data;
    this.consultas = consultas;
    this._route.queryParamMap.pipe(
      untilDestroyed(this), 
      tap((params) => {
        if (!params.get('limit')) {
          this.limit = 4;
        }
      }),
      switchMap(params => this._apiService.consultasJuridicas(+(params.get('limit') || 4))))
      .subscribe(res => {
        this.consultas = res;
        this.showMore = this.consultas.length >= this.limit;
      })
  }

  loadMore() {
    this.limit += 6;
    this._router.navigate([], {
      queryParams: { limit: this.limit },
      queryParamsHandling: 'merge',
      relativeTo: this._route,
    })
  }

}
