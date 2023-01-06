import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, args: string): any {
    if (!value) return;
    if (!args) return;

    // clean string;
    const isExactMatch = args.includes('"');

    const text = this.normalizeText(value);

    if (isExactMatch) {
      const _arg = args.replace(/["]/g, '');
      const matches = text.match(new RegExp(_arg, 'gi'));
      const match = matches?.[0];
      if (!match) return;
      return this.extractFromSingleMatch(match, text, 180);
    } else {
      let regExp: RegExp;
      if (args.includes(" ")) {
        const _search = args.split(" ").join("|");
        regExp = new RegExp(_search, 'gi');
      } else {
        regExp = new RegExp(args, 'gi');
      }
      const matches = text.match(regExp);
      const match = matches?.[0];
      if (!match) return;
      return this.extractFromSingleMatch(match, text, 180);
    }
  }

  private normalizeText(text: string): string {
    return new DOMParser().parseFromString(text, 'text/html').body.textContent || "";
  }

  private extractFromSingleMatch(match: string, text: string, interval: number) {
    const length = match.length;
    const start = text.indexOf(match);
    const end = start + length;
    const extStart = (start - interval) < 0 ? 0 : start - interval;
    const extEnd = (end + interval) > text.length ? text.length : end + interval;
    const highlight = new RegExp(match, 'gi');
    const res = text.substring(extStart, extEnd) || "";
    // const res = text.substring(extStart, extEnd)?.replace(highlight, '<mark>$&</mark>') || "";
    return `[...${res}...]`;
  }
}
