import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss'],
})
export class KeywordsComponent implements OnInit {
  letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  results = [
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
    'Canasta Familiar',
  ];

  currentLetter = 'A';

  constructor() {}

  ngOnInit() {}
}
