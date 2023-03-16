import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-analysis-detail',
  templateUrl: './analysis-detail.component.html',
  styleUrls: ['./analysis-detail.component.scss']
})
export class AnalysisDetailComponent implements OnInit, OnDestroy {

  article: any = null;
  fq: any[] = [];

  constructor(private _route: ActivatedRoute, private _meta: Meta) {
    this._meta.addTag({ name: 'robots', content: 'noindex' });
  }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.article = data.data[0];
      this.fq = data.data[1] || [];
    });
  }

  ngOnDestroy(): void {
    this._meta.removeTag('name=robots');
  }

}
