import { map, tap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ScreenSize } from '@app/@shared/model/screen-size.enum';
import { DataService } from '@app/@shared/services/data.service';
import { ScreenSizeService } from '@app/@shared/services/screen-size.service';
import { Observable } from 'rxjs';
import { CarouselComponent } from 'angular-responsive-carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit {
  quote: string | undefined;
  isLoading = false;

  recent$: Observable<any[]>;
  popular$: Observable<any[]>;

  constructor(
    private dataService: DataService,
    private screenSizeService: ScreenSizeService,
    private cdRef: ChangeDetectorRef
  ) {
    this.recent$ = this.dataService.recentNormative();
    this.popular$ = this.dataService.popularNormative();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {}
}
