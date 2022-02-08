import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import { DataService } from './../../@shared/services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PagedResult } from '@app/@shared/model/paged-result';
import { Infographic } from '@app/@shared/model/infographic';
import { GALLERY_CONF, GALLERY_IMAGE, NgxImageGalleryComponent } from 'ngx-image-gallery';

@Component({
  selector: 'app-infographics',
  templateUrl: './infographics.component.html',
  styleUrls: ['./infographics.component.scss'],
})
export class InfographicsComponent implements OnInit {

  results$?: Observable<PagedResult<Infographic>>;
  images$?: Observable<GALLERY_IMAGE[]>;

  @ViewChild(NgxImageGalleryComponent) ngxImageGallery?: NgxImageGalleryComponent;

  config = <GALLERY_CONF>{
    showArrows: false,
    inline: true,
    backdropColor: 'transparent'
  }

  constructor(
    private _dataService: DataService,
    private _modal: NgbModal
  ) {}

  ngOnInit() {
    this.results$ = this._dataService.getInfographics();
    this.images$ = this.results$?.pipe(map((res) => {
      return res.results?.map(e => <GALLERY_IMAGE> {
        url: e.imagen,
        title: e.titulo
      });
    }))
  }

  openGallery(galleryTemp: any) {
    this._modal.open(galleryTemp, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      modalDialogClass:'gallery-modal',
      backdropClass: 'gallery-backdrop'
    })
  }
}
