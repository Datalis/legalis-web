import { Gazette } from '@app/@shared/model/gazette';
import { Params } from '@app/@shared/model/params';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ScreenSize } from '@app/@shared/model/screen-size.enum';
import { DataService } from '@app/@shared/services/data.service';
import { ScreenSizeService } from '@app/@shared/services/screen-size.service';
import { Observable, forkJoin } from 'rxjs';
import { CarouselComponent } from 'angular-responsive-carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  quote: string | undefined;
  isLoading = true;

  recent?: Gazette;
  popular: any[] = [];

  constructor(
    private dataService: DataService,
    private screenSizeService: ScreenSizeService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {

    forkJoin([
      this.dataService.getLatestGazette(), 
      this.dataService.popularNormative()]
    )
    .pipe().subscribe(([recent, popular]) => {
      this.recent = recent;
      this.popular = popular || [];
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {}
}
