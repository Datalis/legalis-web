import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { LayoutService } from '@app/@shared/services/layout.service';

@Component({
  selector: 'app-analysis-detail',
  templateUrl: './analysis-detail.component.html',
  styleUrls: ['./analysis-detail.component.scss']
})
export class AnalysisDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  article: any = null;
  fq: any[] = [];

  constructor(private _route: ActivatedRoute, private _meta: Meta, private _layoutService: LayoutService) {
    this._meta.addTag({ name: 'robots', content: 'noindex' });
  }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.article = data.data[0];
      this.fq = data.data[1] || [];
    });
  }

  ngAfterViewInit(): void {
    this._route.url.subscribe(url => {
      const fragment = this._route.snapshot.fragment;
      if (fragment) {
        this._layoutService.scrollToElement("#article-content")
      } else {
        this._layoutService.scrollToTop();
      }
    })

  }

  ngOnDestroy(): void {
    this._meta.removeTag('name=robots');
  }

  getImage = (url: string) => url.startsWith('/') ? `https://api.eltoque.com${url}` : url;

}
