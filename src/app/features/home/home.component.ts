import { ActivatedRoute } from '@angular/router';
import { Normative } from './../../@shared/model/normative';
import { Infographic } from '@app/@shared/model/infographic';
import { Gazette } from '@app/@shared/model/gazette';
import { Params } from '@app/@shared/model/params';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ScreenSize } from '@app/@shared/model/screen-size.enum';
import { ScreenSizeService } from '@app/@shared/services/screen-size.service';
import { Observable, forkJoin } from 'rxjs';
import { CarouselComponent } from 'angular-responsive-carousel';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from '@app/@shared/services/api.service';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  recentGazette: Gazette | null = null;
  popularNormatives: Normative[] = [];
  infographics: Infographic[] = [];
  relatedNews: any[] = [];

  constructor(
    private apiService: ApiService,
    private screenSizeService: ScreenSizeService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const [popularRes, recentRes, newsRes, infogRes] = this.route.snapshot.data.data;

    this.relatedNews = newsRes || [];
    this.popularNormatives = popularRes.results || [];
    this.recentGazette = recentRes.results ? recentRes.results[0] : null;
    this.infographics = infogRes.results ? infogRes.results.slice(0, 3) : [];
  }
}
