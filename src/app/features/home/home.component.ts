import { ActivatedRoute } from '@angular/router';
import { Normative } from './../../@shared/model/normative';
import { Infographic } from '@app/@shared/model/infographic';
import { Gazette } from '@app/@shared/model/gazette';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { isPlatformBrowser } from '@angular/common';
import { SamiChatService } from '@app/@shared/components/sami-chat/sami-chat.service';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  recentGazettes: Gazette[] = [];
  recentGazettesDate: string | null = null;
  popularNormatives: Normative[] = [];
  infographics: Infographic[] = [];
  relatedNews: any[] = [];
  consultas: any[] = [];

  isBrowser: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private samiChat: SamiChatService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  openSami() {
    this.samiChat.open();
  }

  subscribe() {
    let URL = "https://dashboard.mailerlite.com/forms/654880/105395635489867128/share";
    window.open(URL, '_blank');
    console.log('this')
  }


  async ngOnInit() {
    const [popularRes, recentRes, newsRes, infogRes, consultasRes] = this.route.snapshot.data.data;

    this.relatedNews = newsRes || [];
    this.popularNormatives = popularRes.results || [];
    this.infographics = infogRes.results ? infogRes.results.slice(0, 3) : [];
    this.consultas = consultasRes || [];

    const allGazettes: Gazette[] = recentRes.results || [];
    if (allGazettes.length > 0) {
      const latestDate = allGazettes[0].date;
      this.recentGazettesDate = latestDate || null;
      this.recentGazettes = allGazettes.filter(g => g.date === latestDate);
    }
  }

  getImage = (url: string) => url.startsWith('/') ? `https://api.eltoque.com${url}` : url;

}
