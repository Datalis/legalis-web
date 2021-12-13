import { Component, OnInit, Input } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  animOptions: AnimationOptions = {
    path: '/assets/anim.json',
  };

  constructor() {}

  ngOnInit() {}
}
