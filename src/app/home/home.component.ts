import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ScreenSize } from '@app/@shared/model/screen-size.enum';
import { DataService } from '@app/@shared/services/data.service';
import { ScreenSizeService } from '@app/@shared/services/screen-size.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;

  cellsToShow = 1;

  recent$: Observable<any[]>;
  popular$: Observable<any[]>;

  constructor(private dataService: DataService, private screenSizeService: ScreenSizeService) {
    this.recent$ = this.dataService.recentNormative();
    this.popular$ = this.dataService.popularNormative();
  }

  ngOnInit() {
    this.isLoading = true;
  }
}
