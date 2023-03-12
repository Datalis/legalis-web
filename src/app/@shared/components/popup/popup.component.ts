import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  constructor() { }

  showPopup = false;

  ngOnInit() {
    const showed = localStorage.getItem('show-welcome-popup');
    if (!showed) {
      this.showPopup = true;
      localStorage.setItem('show-welcome-popup', '1');
    }
  }

  onSubscribe() {
    let URL = "https://sumavoces.us16.list-manage.com/subscribe?u=2c3cee32035916c525e68d623&id=341cef9774"
    // URL = URL + '&MERGE0=' + this.subscribeEmail;
    window.open(URL, '_blank');
    console.log('this')
    this.showPopup = false;
  }

}
