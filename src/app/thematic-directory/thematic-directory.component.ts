import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thematic-directory',
  templateUrl: './thematic-directory.component.html',
  styleUrls: ['./thematic-directory.component.scss'],
})
export class ThematicDirectoryComponent implements OnInit {
  subjects = [
    'Administrativa',
    'Aduana',
    'Civil',
    'Comunicación',
    'Constitucional',
    'Cultural',
    'Comunicación',
    'Constitucional',
    'Cultural',
    'Comunicación',
    'Constitucional',
    'Cultural',
    'Comunicación',
    'Constitucional',
    'Cultural',
  ];

  currentSubject = 0;

  constructor() {}

  ngOnInit() {}
}
