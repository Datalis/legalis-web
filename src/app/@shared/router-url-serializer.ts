import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class RouterUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    url = url.replace(/\+/g, '%20');
    return super.parse(url);
  }
  serialize(tree: UrlTree): string {
    return super.serialize(tree).replace(/%20/g, '+');
  }
}
