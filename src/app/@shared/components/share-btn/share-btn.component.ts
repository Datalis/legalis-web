import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-btn',
  templateUrl: './share-btn.component.html',
  styleUrls: ['./share-btn.component.scss']
})
export class ShareBtnComponent implements OnInit {

  isOpen = false;

  networks = [
    {
      label: "telegram",
      url: '/',
      icon: 'fa-telegram'
    },
    {
      label: "whatsapp",
      url: '/',
      icon: 'fa-whatsapp'
    },
    {
      label: "facebook",
      url: '/',
      icon: 'fa-facebook-f'
    },
    {
      label: "twitter",
      url: '/',
      icon: 'fa-twitter'
    }
  ];

  constructor() { }

  onShare(item: any) {
    const host = window?.location?.hostname || 'localhost';
    const path = window?.location?.pathname || '/';
    const shareUrl = encodeURI(`https://${host}${path}`);
    let socialUrl;
    switch (item.label) {
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer.php?u=${shareUrl}`;
        break;
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?url=${shareUrl}`;
        break;
      case 'whatsapp':
        socialUrl = `https://api.whatsapp.com/send?text=${shareUrl}`;
        break;
      case 'telegram':
        socialUrl = `https://t.me/share/url?url=${shareUrl}`;
        break;  
      default:
        break;
    }
    window?.open(socialUrl, '_blank');
  }

  ngOnInit() {
  }

}
