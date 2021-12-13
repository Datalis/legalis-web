import { Directory } from '@app/@shared/model/directory';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-directory-item',
  templateUrl: './directory-item.component.html',
  styleUrls: ['./directory-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DirectoryItemComponent implements OnInit {
  @Input() item!: Directory;

  @Input() isActive = false;

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit() {}

  getSVGIconFor(content?: string): any {
    return content ? this._sanitizer.bypassSecurityTrustHtml(content) : null;
  }

  onDirectorySelected(item: Directory) {}
}
