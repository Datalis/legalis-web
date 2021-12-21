import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor() {}

  scrollToTop(): void {
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToItem(id: any) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
