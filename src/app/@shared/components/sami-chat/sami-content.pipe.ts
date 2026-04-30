import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ContentBlock } from './sami-chat.types';

const ELTOQUE_URLS = new Set([
  'https://eltoque.com',
  'https://eltoque.com/',
  'https://eltoque.com?utm_source=sami',
  'https://eltoque.com/?utm_source=sami',
]);

const URL_REGEX = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/g;
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?.*)?$/i;
const IMAGE_HOSTS = [
  'imgur.com',
  'picsum.photos',
  'placeholder.com',
  'unsplash.com',
  'pexels.com',
  'cloudinary.com',
  'googleusercontent.com',
];
const INLINE_TAGS = ['b', 'strong', 'i', 'em', 'u'];

// The bot prepends or appends this disclaimer to most replies. We pull it
// out and render it with a smaller, framed style. The match terminates at
// the Telegram URL so we don't accidentally swallow the body of the message
// when the disclaimer comes first.
const DISCLAIMER_REGEX = /(?:⚠️|⚠️|⚠)\s*Esta orientación tiene carácter informativo[\s\S]*?https?:\/\/t\.me\/LegalisElToque\b/i;

@Pipe({ name: 'samiContent', pure: true })
export class SamiContentPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(content: string | null | undefined): ContentBlock[] {
    if (!content) return [];
    const normalized = this.normalizeContent(content);
    if (typeof window !== 'undefined' && (window as any).__samiDebug) {
      console.log('[sami] raw:', JSON.stringify(content));
      console.log('[sami] normalized:', JSON.stringify(normalized));
    }

    // Pull out the disclaimer (if any) before tokenizing the body. The
    // disclaimer can appear at the start, end, or even middle of the message
    // depending on the model's mood, so we re-stitch the surrounding text.
    let body = normalized;
    let disclaimerHtml: SafeHtml | null = null;
    const disclaimerMatch = normalized.match(DISCLAIMER_REGEX);
    if (disclaimerMatch && disclaimerMatch.index != null) {
      const start = disclaimerMatch.index;
      const end = start + disclaimerMatch[0].length;
      body = (normalized.slice(0, start) + '\n' + normalized.slice(end))
        .replace(/\n{2,}/g, '\n')
        .trim();
      disclaimerHtml = this.processFullText(disclaimerMatch[0].trim());
    }

    const blocks: ContentBlock[] = [];
    if (body) {
      const parts = body.split(URL_REGEX);
      parts.forEach((part, idx) => {
        if (!part) return;
        const isUrl = idx % 2 === 1;

        if (isUrl) {
          const cleanUrl = part.replace(/[.,;!?]+$/, '');
          if (ELTOQUE_URLS.has(cleanUrl)) {
            blocks.push({ kind: 'eltoque', url: cleanUrl });
          } else if (this.isImageUrl(cleanUrl)) {
            blocks.push({ kind: 'image', url: cleanUrl });
          } else {
            blocks.push({ kind: 'link', url: cleanUrl });
          }
        } else {
          blocks.push({ kind: 'html', html: this.processInlineMarkup(part) });
        }
      });
    }

    if (disclaimerHtml) {
      blocks.push({ kind: 'disclaimer', html: disclaimerHtml });
    }

    return blocks;
  }

  /**
   * Like processInlineMarkup but also turns plain URLs into <a> elements.
   * Used for the disclaimer block, where we want everything (text + link)
   * inside a single styled container.
   */
  private processFullText(text: string): SafeHtml {
    let s = this.escapeHtml(text);
    for (const tag of INLINE_TAGS) {
      s = s
        .replace(new RegExp(`&lt;${tag}(?:\\s[^&]*)?&gt;`, 'gi'), `<${tag}>`)
        .replace(new RegExp(`&lt;/${tag}\\s*&gt;`, 'gi'), `</${tag}>`);
    }
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(URL_REGEX, (url) => {
      const clean = url.replace(/[.,;!?]+$/, '');
      return `<a href="${clean}" target="_blank" rel="noopener noreferrer">${clean}</a>`;
    });
    s = s.replace(/<(u|b|strong|i|em)>\s*<\/\1>/gi, '');
    return this.sanitizer.bypassSecurityTrustHtml(s);
  }

  private isImageUrl(url: string): boolean {
    return IMAGE_EXTENSIONS.test(url) || IMAGE_HOSTS.some((host) => url.includes(host));
  }

  /**
   * Normalize raw content from the backend before we tokenize URLs:
   *   - turn <br> / </p><p> / </p> / <p> into \n
   *   - collapse runs of newlines (with whitespace between) into a single \n
   *   - trim leading/trailing whitespace
   * After this, only inline formatting tags survive (<b>, <i>, <u>, …) and
   * newlines are real \n characters that pre-wrap will render as soft breaks.
   */
  private normalizeContent(input: string): string {
    let s = input;
    s = s.replace(/<br\s*\/?>(?!\w)/gi, '\n');
    s = s.replace(/<\/p\s*>\s*<p[^>]*>/gi, '\n');
    s = s.replace(/<\/?p[^>]*>/gi, '\n');
    s = s.replace(/<(u|b|strong|i|em)[^>]*>\s*<\/\1>/gi, '');
    // Collapse runs of whitespace-only newlines into a single newline.
    s = s.replace(/[ \t]*\n(?:[ \t]*\n)+[ \t]*/g, '\n');
    s = s.replace(/\n{2,}/g, '\n');
    return s.trim();
  }

  private processInlineMarkup(text: string): SafeHtml {
    let s = this.escapeHtml(text);
    for (const tag of INLINE_TAGS) {
      s = s
        .replace(new RegExp(`&lt;${tag}(?:\\s[^&]*)?&gt;`, 'gi'), `<${tag}>`)
        .replace(new RegExp(`&lt;/${tag}\\s*&gt;`, 'gi'), `</${tag}>`);
    }
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Strip empty inline wrappers that survived (e.g. <u>   </u>).
    s = s.replace(/<(u|b|strong|i|em)>\s*<\/\1>/gi, '');
    return this.sanitizer.bypassSecurityTrustHtml(s);
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
