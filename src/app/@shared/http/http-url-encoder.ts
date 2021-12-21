import { HttpParameterCodec } from '@angular/common/http';

export class HttpUrlEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return key;
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return key;
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
