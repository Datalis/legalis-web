import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-normative-item',
  templateUrl: './normative-item.component.html',
  styleUrls: ['./normative-item.component.scss'],
})
export class NormativeItemComponent implements OnInit {
  @Input() item: any;
  @Input() searchQuery = '';

  expanded = false;

  constructor() {}

  ngOnInit() {}

  get isActive(): boolean {
    return this.item.state == 'Activa' || this.item.state == 'Vigente';
  }
}
