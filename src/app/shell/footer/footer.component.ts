import { LayoutService } from './../../@shared/services/layout.service';
import { Component, OnInit } from '@angular/core';
//import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  $news?: Observable<any[]>;

  isSmallScreen = false;

  constructor(
    private _router: Router,
    //private _dataService: DataService,
    private _layoutService: LayoutService) {}

  ngOnInit() {
    //this.$news = this._dataService.getLatestNews();
    this._layoutService.isSmallScreen$.pipe(untilDestroyed(this)).subscribe((small) => (this.isSmallScreen = small));
  }

  goTo(path: string) {
    this._router.navigate([path]).then(() => {
      /*setTimeout(() => {
        this._layoutService.scrollToTop();
      }, 100)*/
    });
  }
}
