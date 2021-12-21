import {
  catchError,
  concatMap,
  finalize,
  map,
  tap,
  switchMap,
  shareReplay,
  mergeMap,
  share,
  takeLast,
  mergeAll,
  combineAll,
  find,
  withLatestFrom,
  concatAll,
  zipAll,
} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Directory } from '@app/@shared/model/directory';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, Subscription, throwError, of, EMPTY, forkJoin, combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@app/@shared';

@UntilDestroy()
@Component({
  selector: 'app-thematic-directory',
  templateUrl: './thematic-directory.component.html',
  styleUrls: ['./thematic-directory.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThematicDirectoryComponent implements OnInit, AfterViewInit, OnDestroy {
  currentPage = 1;

  directories?: any[];
  rootDirectories?: any[];
  childDirectories?: any[];
  currentDirectory?: any;
  breadcrumbs?: any[];

  loadingDirectories = false;
  loadingNormatives = false;

  rootPath = 'thematic-directory';

  itemsPerPage = 4;

  normatives$?: Observable<PagedResult<Normative> | null>;

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    combineLatest([
      this._route.url.pipe(map((res) => res.map((e) => e.path))),
      this._route.queryParams,
      this._dataService.getDirectories().pipe(
        map((res) => res.results),
        shareReplay(1)
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        const paths = res[0];
        const queryParams = res[1];
        const directories = res[2] || [];

        this.breadcrumbs = this.createBreadcrumbs(paths);

        this.directories = this.toArray(directories);
        this.rootDirectories = this.getRootDirectories(this.directories);
        const parentId = this.getParentId(paths, this.directories);
        this.currentDirectory = this.directories.find((e) => e.id == parentId);

        this.currentPage = +queryParams.page || 1;

        if (this.currentDirectory) {
          this.childDirectories = this.getChildDirectories(this.directories, this.currentDirectory);
          this.normatives$ = this._dataService.getNormativesByDirectory(
            this.currentDirectory.id,
            this.currentPage,
            this.itemsPerPage
          );
        } else {
          // No current directory. Redirect to first
          const firstDirectory = this.directories[0];
          this._router.navigate([this.rootPath, firstDirectory.path]);
        }
      });
  }

  ngAfterViewInit() {}

  private getRootDirectories(directories: any[]) {
    return directories?.filter((e) => e.parentId == 0) || [];
  }

  private getChildDirectories(directories: any[], current: any) {
    return directories?.filter((e) => e.parentId == current.id) || [];
  }

  getParentId(path: string[], arr: any[]): number | null {
    let parentId = 0;
    for (const p of path) {
      const _parent = arr.find((e) => {
        return e.parentId == parentId && e.path == p;
      });
      if (_parent) {
        parentId = _parent.id;
      } else {
        return null;
      }
    }
    return parentId;
  }

  goToDirectory(item: any) {
    this._router.navigate([this.rootPath, item.path]);
  }

  getPage(page: number) {
    this.currentPage = page;
    this._router.navigate([], {
      queryParams: { page: this.currentPage },
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }

  createBreadcrumbs(path: string[]): any[] {
    let fullPath: string[] = ['/', this.rootPath];
    var breadcrumbs = path.map((p) => {
      fullPath.push(p);
      return {
        name: decodeURIComponent(p),
        path: [...fullPath],
      };
    });
    return breadcrumbs;
  }

  getSVGIconFor(content?: string): any {
    return content ? this._sanitizer.bypassSecurityTrustHtml(content) : null;
  }

  onDirectorySelected(directory: Directory): void {
    //this.currentDirectory = directory;
    //this.normatives$ = this._dataService.getNormativesByDirectory(this.currentDirectory.id!!);
  }

  ngOnDestroy(): void {
    //this.subscriptions.forEach((s) => s.unsubscribe());
  }

  toArray(data: Directory[], parent?: Directory): any[] {
    const _flatten: any[] = [];
    data.forEach((e) => {
      _flatten.push({
        id: e.id,
        name: e.name,
        path: encodeURIComponent(e.name!!),
        icon: e.icon,
        description: e.description,
        normatives: e.normatives,
        parentId: parent?.id || 0,
      });
      if (e.children) {
        _flatten.push(...this.toArray(e.children, e));
      }
    });
    return _flatten;
  }
}
