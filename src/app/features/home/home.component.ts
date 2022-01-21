import { Infographic } from '@app/@shared/model/infographic';
import { Gazette } from '@app/@shared/model/gazette';
import { Params } from '@app/@shared/model/params';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ScreenSize } from '@app/@shared/model/screen-size.enum';
import { DataService } from '@app/@shared/services/data.service';
import { ScreenSizeService } from '@app/@shared/services/screen-size.service';
import { Observable, forkJoin } from 'rxjs';
import { CarouselComponent } from 'angular-responsive-carousel';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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

  infog?: Infographic;

  constructor(
    private dataService: DataService,
    private screenSizeService: ScreenSizeService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {

    forkJoin([
      this.dataService.getLatestGazette(),
      this.dataService.popularNormative(),
      this.dataService.getInfographics(),
    ]
    )
    .pipe(untilDestroyed(this)).subscribe(([recent, popular, infographics]) => {
      this.recent = recent;
      this.popular = popular || [];
      this.infog = infographics.results?.[0] || {};
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {}
}
