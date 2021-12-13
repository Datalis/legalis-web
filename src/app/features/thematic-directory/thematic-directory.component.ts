import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Directory } from '@app/@shared/model/directory';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, finalize, find, map, share, tap } from 'rxjs/operators';

@Component({
  selector: 'app-thematic-directory',
  templateUrl: './thematic-directory.component.html',
  styleUrls: ['./thematic-directory.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThematicDirectoryComponent implements OnInit, AfterViewInit, OnDestroy {
  currentDirectory?: Directory;
  currentPage = 1;

  directories$?: Observable<PagedResult<Directory>>;

  normatives$?: Observable<PagedResult<Normative>>;

  subscriptions: Subscription[] = [];

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.directories$ = this._dataService.getDirectories();
    this.subscriptions.push(
      this._route.queryParams.subscribe((params) => {
        const directory = params?.directory || 0;
        const page = params?.page || 1;
      })
    );
  }

  ngAfterViewInit() {}

  getSVGIconFor(content?: string): any {
    return content ? this._sanitizer.bypassSecurityTrustHtml(content) : null;
  }

  onDirectorySelected(directory: Directory): void {
    this.currentDirectory = directory;
    this.normatives$ = this._dataService.getNormativesByDirectory(this.currentDirectory.id!!);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
