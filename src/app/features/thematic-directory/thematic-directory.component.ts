import { ApiService } from '@app/@shared/services/api.service';
import { LayoutService } from './../../@shared/services/layout.service';
import { Params } from '@app/@shared/model/params';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Directory } from '@app/@shared/model/directory';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
//import { DataService } from '@app/@shared/services/data.service';
import { combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@app/@shared';

@UntilDestroy()
@Component({
  selector: 'app-thematic-directory',
  templateUrl: './thematic-directory.component.html',
  styleUrls: ['./thematic-directory.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThematicDirectoryComponent implements OnInit, AfterViewInit {
  currentPage = 1;

  directories: any[] = [];
  rootDirectories: any[] = [];
  childDirectories: any[] = [];

  currentDirectory?: any;
  breadcrumbs?: any[];

  loadingDirectories = false;
  loadingNormatives = false;

  isLoading = true;
  isMenuCollapsed = false;

  rootPath = 'directorio-tematico';

  itemsPerPage = 3;

  results?: PagedResult<Normative>;

  params = new Params();

  constructor(
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _layoutService: LayoutService
  ) {}

  ngOnInit() {
    const res = this._route.snapshot.data.directories;
    this.directories = this.toArray(res);

    combineLatest([
      this._route.url.pipe(map((res) => res.map((e) => e.path))),
      this._route.queryParams.pipe(map((params) => Params.fromObject(params))),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(async ([paths, params]) => {
        this.params.year = null;
        this.params.page_size = this.itemsPerPage;
        this.params.page = params.page || 1;

        this.breadcrumbs = this.createBreadcrumbs(paths);
        this.rootDirectories = this.getRootDirectories(this.directories);

        const parentId = this.getParentId(paths, this.directories);
        this.currentDirectory = this.directories.find((e) => e.id == parentId);

        if (this.currentDirectory) {
          this.childDirectories = this.getChildDirectories(this.directories, this.currentDirectory);
          this.params.directory = this.currentDirectory.id;
          const res = await this._apiService.findNormatives(this.params);
          res.results = res.results.filter((e) => e.state == 'Activa' || e.state == 'Vigente');
          this.results = res;
          /*this.results$ = this._dataService.getNormativeList(this.params).pipe(
            map((res) => ({
              ...res,
              results: res.results.filter(e => e.state == 'Activa' || e.state == 'Vigente')
            }))
          );*/
        } else {
          const firstDirectory = this.directories[0];
          this._router.navigate([this.rootPath, firstDirectory.path], {
            replaceUrl: true,
          });
        }
      });

    this._layoutService.isSmallScreen$.pipe(untilDestroyed(this)).subscribe((small) => (this.isMenuCollapsed = small));
  }

  ngAfterViewInit() {}

  private getRootDirectories(directories: any[]) {
    return directories?.filter((e) => e.parentId == 0) || [];
  }

  private getChildDirectories(directories: any[], current: any) {
    return (directories?.filter((e) => e.parentId == current.id) || []).slice(0, 10);
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

  goToDirectory(path: any[]): void {
    this._router.navigate(path).then(() => {
      this._layoutService.scrollToElement('#content');
    });
  }

  goToSubDirectory(path: any[]): void {
    this._router.navigate(path, { relativeTo: this._route }).then(() => {
      this._layoutService.scrollToElement('#content');
    });
  }

  isActiveDirectory(item: any): boolean {
    const paths = this._route.snapshot.url.map((e) => encodeURIComponent(e.path));
    const path = encodeURIComponent(item.path);
    return paths.some((e) => e == path);
  }

  getPage(page: number) {
    this.currentPage = page;
    this._router
      .navigate([], {
        queryParams: { page: this.currentPage },
        relativeTo: this._route,
        queryParamsHandling: 'merge',
      })
      .then(() => {
        this._layoutService.scrollToElement('#content');
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
