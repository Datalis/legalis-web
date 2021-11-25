import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  $news?: Observable<any[]>;

  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this.$news = this._dataService.getLatestNews();
  }
}
