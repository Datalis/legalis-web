import { ElToquePost } from '@app/@shared/model/eltoque-post';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-questions-widget',
  templateUrl: './recent-questions-widget.component.html',
  styleUrls: ['./recent-questions-widget.component.scss']
})
export class RecentQuestionsWidgetComponent implements OnInit {

  @Input()
  data: ElToquePost[] = [];

  constructor() { }

  ngOnInit() {
  }

}
