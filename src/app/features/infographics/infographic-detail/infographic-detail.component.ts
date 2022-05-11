import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
//import { DataService } from '@app/@shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { Infographic } from '@app/@shared/model/infographic';

@Component({
  selector: 'app-infographic-detail',
  templateUrl: './infographic-detail.component.html',
  styleUrls: ['./infographic-detail.component.scss'],
})
export class InfographicDetailComponent implements OnInit {
  info?: Infographic;

  constructor(private _route: ActivatedRoute, private _title: Title) {}

  ngOnInit() {
    this.info = this._route.snapshot.data.data;
    this._title.setTitle(`Legalis - ${this.info?.titulo}`);
  }
}
