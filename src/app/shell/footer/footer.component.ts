import { LayoutService } from './../../@shared/services/layout.service';
import { Component, OnInit } from '@angular/core';
//import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { NgControl } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  $news?: Observable<any[]>;

  isSmallScreen = false;
  invalidForm = false;
  subscribeEmail = '';

  constructor(
    private _router: Router,
    //private _dataService: DataService,
    private _layoutService: LayoutService) {}

  ngOnInit() {
    //this.$news = this._dataService.getLatestNews();
    this._layoutService.isSmallScreen$.pipe(untilDestroyed(this)).subscribe((small) => (this.isSmallScreen = small));
  }

  subscribe() {
    let URL = "https://sumavoces.us16.list-manage.com/subscribe?u=2c3cee32035916c525e68d623&id=341cef9774"
    URL = URL + '&MERGE0=' + this.subscribeEmail;
    window.open(URL, '_blank');
    console.log('this')
  }

  goTo(path: string) {
    this._router.navigate([path]).then(() => {
      /*setTimeout(() => {
        this._layoutService.scrollToTop();
      }, 100)*/
    });
  }
}
