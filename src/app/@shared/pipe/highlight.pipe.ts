import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, args: any): any {
    if (!value) return;
    if (!args) return value;

    const INTERVAL = 180;

    // clean string;
    value = new DOMParser().parseFromString(value, 'text/html').body.textContent || "";
    const validReg = new RegExp(/[^a-zA-Z0-9 ]/g);
    value = value.replace(validReg, '');

    const re = new RegExp(args, 'gi');
    const matches = value.match(re);

    if (!matches) return value;

    const m = matches[0];
    const length = m.length;
    const start = value.indexOf(m);
    const end = start + length;
    const extStart = (start - INTERVAL) < 0 ? 0 : start - INTERVAL;
    const extEnd = (end + INTERVAL) > value.length ? value.length : end + INTERVAL;
    let text = value.substring(extStart, extEnd);

    console.log({m, length, start, end, extStart, extEnd, text, value})

    text = `[...${text}...]`

    return text.replace(re, '<mark>$&</mark>');
  }
}
