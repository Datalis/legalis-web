import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Directory } from '@app/@shared/model/directory';
import { Normative } from '@app/@shared/model/normative';
import { PagedResult } from '@app/@shared/model/paged-result';
import { DataService } from '@app/@shared/services/data.service';
import { Observable } from 'rxjs';
import { distinctUntilChanged, find, map, share } from 'rxjs/operators';

@Component({
  selector: 'app-thematic-directory',
  templateUrl: './thematic-directory.component.html',
  styleUrls: ['./thematic-directory.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThematicDirectoryComponent implements OnInit, AfterViewInit {
  subjects = [
    {
      name: 'Administrativa',
      icon: 'admin.svg',
    },
    {
      name: 'Aduana',
      icon: 'aduana.svg',
    },
    {
      name: 'Civil',
      icon: 'civil.svg',
    },
    {
      name: 'Comunicación',
      icon: 'comunicacion.svg',
    },
    {
      name: 'Constitucional',
      icon: 'constitucional.svg',
    },
    {
      name: 'Cultural',
      icon: 'cultural.svg',
    },
    {
      name: 'Económico',
      icon: 'economico.svg',
    },
    {
      name: 'Educación',
      icon: 'educacion.svg',
    },
    {
      name: 'Familia',
      icon: 'familia.svg',
    },
    {
      name: 'Financiero',
      icon: 'financiero.svg',
    },
    {
      name: 'Laboral',
      icon: 'laboral.svg',
    },
    {
      name: 'Medio Ambiente',
      icon: 'medio-ambiente.svg',
    },
    {
      name: 'Mercantil',
      icon: 'mercantil.svg',
    },
    {
      name: 'Penal',
      icon: 'penal.svg',
    },
    {
      name: 'Procesal',
      icon: 'procesal.svg',
    },
    {
      name: 'Salud',
      icon: 'salud.svg',
    },
    {
      name: 'Cuenta Propia',
      icon: 'cuenta-propia.svg',
    },
    {
      name: 'Tributario',
      icon: 'tributario.svg',
    },
    {
      name: 'Vivienda',
      icon: 'vivienda.svg',
    },
  ];

  currentDirectory?: Directory;

  directories$?: Observable<Directory[]>;
  normatives$?: Observable<PagedResult<Normative>>;

  currentPage: number = 0;

  constructor(private _dataService: DataService, private _sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.directories$ = this._dataService.getDirectories().pipe(map((res) => res.results || []));
  }

  ngAfterViewInit() {}

  getSVGIconFor(content?: string): any {
    return content ? this._sanitizer.bypassSecurityTrustHtml(content) : 'NO_ICON!!';
  }

  onDirectorySelected(directory: Directory): void {
    this.currentDirectory = directory;
    this.currentDirectory.id &&
      (this.normatives$ = this._dataService.getNormativesByDirectory(this.currentDirectory?.id));
  }
}
