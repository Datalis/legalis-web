import { Gazette } from '@app/@shared/model/gazette';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gazette-item',
  templateUrl: './gazette-item.component.html',
  styleUrls: ['./gazette-item.component.scss']
})
export class GazetteItemComponent implements OnInit {

  @Input() item!: Gazette;

  constructor() { }

  ngOnInit() {
  }

}
