import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SamiChatService {
  private readonly _toggle$ = new Subject<boolean>();
  readonly toggle$ = this._toggle$.asObservable();

  private readonly _context$ = new BehaviorSubject<string | null>(null);
  readonly context$ = this._context$.asObservable();

  open() {
    this._toggle$.next(true);
  }

  close() {
    this._toggle$.next(false);
  }

  /**
   * Set a piece of context (e.g. the legal norm the user is currently viewing)
   * that will be silently prepended to every user message sent to the backend.
   * It is NOT shown in the chat bubble — only included in the API payload.
   */
  setContext(label: string | null | undefined) {
    const value = label?.trim() || null;
    if (this._context$.value !== value) {
      this._context$.next(value);
    }
  }

  clearContext() {
    if (this._context$.value !== null) {
      this._context$.next(null);
    }
  }

  get context(): string | null {
    return this._context$.value;
  }
}
