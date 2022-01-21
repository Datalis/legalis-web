import { HttpParameterCodec } from '@angular/common/http';

export class HttpUrlEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return key;
  }
  encodeValue(value: string): string {
    if (typeof value == 'string' && value.includes(' ')) {
      value = `"${value}"`
    }
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return key;
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
