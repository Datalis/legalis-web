import { ActivatedRoute } from '@angular/router';
import { Normative } from './../../@shared/model/normative';
import { Infographic } from '@app/@shared/model/infographic';
import { Gazette } from '@app/@shared/model/gazette';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { isPlatformBrowser } from '@angular/common';

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
  consultas: any[] = [];

  isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private route: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  openTawk() {
    let w = window as any;
    if (w.Tawk_API) {
      w.Tawk_API.maximize();
    }
  }

  async ngOnInit() {
    const [popularRes, recentRes, newsRes, infogRes, consultasRes] = this.route.snapshot.data.data;

    this.relatedNews = newsRes || [];
    this.popularNormatives = popularRes.results || [];
    this.recentGazette = recentRes.results ? recentRes.results[0] : null;
    this.infographics = infogRes.results ? infogRes.results.slice(0, 3) : [];
    this.consultas = consultasRes || [];
  }
}
