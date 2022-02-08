import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeUri',
})
export class DecodeUriPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return '';
    value = new DOMParser().parseFromString(value, 'text/html').body.textContent || ""
    return decodeURIComponent(value);
  }

}
