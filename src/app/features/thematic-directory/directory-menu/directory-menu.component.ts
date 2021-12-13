import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Directory } from '@app/@shared/model/directory';

@Component({
  selector: 'app-directory-menu',
  templateUrl: './directory-menu.component.html',
  styleUrls: ['./directory-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DirectoryMenuComponent implements OnInit {
  @Input() directories: Directory[] = [];

  selectedItem?: Directory;

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit() {}

  getSVGIconFor(content?: string): any {
    return content ? this._sanitizer.bypassSecurityTrustHtml(content) : null;
  }

  onItemSelected(item: Directory) {
    if (this.selectedItem && this.selectedItem.id === item.id) {
      this.selectedItem = undefined;
      return;
    }
    this.selectedItem = item;
  }
}
