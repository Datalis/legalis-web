import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thematic-directory',
  templateUrl: './thematic-directory.component.html',
  styleUrls: ['./thematic-directory.component.scss'],
})
export class ThematicDirectoryComponent implements OnInit {
  subjects = [
    {
      name: 'Administrativa',
      icon: 'admin.svg',
    },
    {
      name: 'Aduana',
      icon: 'aduana.svg',
    },
    {
      name: 'Civil',
      icon: 'civil.svg',
    },
    {
      name: 'Comunicación',
      icon: 'comunicacion.svg',
    },
    {
      name: 'Constitucional',
      icon: 'constitucional.svg',
    },
    {
      name: 'Cultural',
      icon: 'cultural.svg',
    },
    {
      name: 'Económico',
      icon: 'economico.svg',
    },
    {
      name: 'Educación',
      icon: 'educacion.svg',
    },
    {
      name: 'Familia',
      icon: 'familia.svg',
    },
    {
      name: 'Financiero',
      icon: 'financiero.svg',
    },
    {
      name: 'Laboral',
      icon: 'laboral.svg',
    },
    {
      name: 'Medio Ambiente',
      icon: 'medio-ambiente.svg',
    },
    {
      name: 'Mercantil',
      icon: 'mercantil.svg',
    },
    {
      name: 'Penal',
      icon: 'penal.svg',
    },
    {
      name: 'Procesal',
      icon: 'procesal.svg',
    },
    {
      name: 'Salud',
      icon: 'salud.svg',
    },
    {
      name: 'Cuenta Propia',
      icon: 'cuenta-propia.svg',
    },
    {
      name: 'Tributario',
      icon: 'tributario.svg',
    },
    {
      name: 'Vivienda',
      icon: 'vivienda.svg',
    },
  ];

  currentSubject = 0;

  constructor() {}

  ngOnInit() {}
}
