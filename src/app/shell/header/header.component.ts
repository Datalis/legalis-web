import { UntilDestroy, untilDestroyed } from '@shared';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapseFilterNav = true;

  query = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(untilDestroyed(this)).subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.collapseFilterNav = true;
      }
    });
  }

  ngOnDestroy(): void {}

  onSearchClicked(): void {
    this.router.navigate(['search'], { queryParams: { query: this.query } });
  }
}
