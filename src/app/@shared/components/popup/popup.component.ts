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
    let URL = "https://dashboard.mailerlite.com/forms/654880/105395635489867128/share"
    // URL = URL + '&MERGE0=' + this.subscribeEmail;
    window.open(URL, '_blank');
    console.log('this')
    this.showPopup = false;
  }

}
