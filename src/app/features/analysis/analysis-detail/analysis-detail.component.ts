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

  constructor(private _route: ActivatedRoute, private _meta: Meta) {
    this._meta.addTag({ name: 'robots', content: 'noindex' });
  }
  
  ngOnInit() {
    let data = this._route.snapshot.data.data;
    this.article = data;
  }

  ngOnDestroy(): void {
    this._meta.removeTag('name=robots');
    console.log('exited')
  }
  
}
