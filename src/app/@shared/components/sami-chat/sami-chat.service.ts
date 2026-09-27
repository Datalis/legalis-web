import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface SamiNormContext {
  normId: string | number;
}

@Injectable({ providedIn: 'root' })
export class SamiChatService {
  private readonly _toggle$ = new Subject<boolean>();
  readonly toggle$ = this._toggle$.asObservable();

  private readonly _normContext$ = new BehaviorSubject<SamiNormContext | null>(null);
  readonly normContext$ = this._normContext$.asObservable();

  open() {
    this._toggle$.next(true);
  }

  close() {
    this._toggle$.next(false);
  }

  /**
   * Tell the chat which legal norm the user is currently viewing. The
   * backend `/api/legal-chat` endpoint accepts a `context.normId` field and
   * pulls the norm directly from the legal DB — so the agent no longer has
   * to figure it out from prose. Pass null/undefined to clear.
   */
  setNormContext(ctx: SamiNormContext | null | undefined) {
    const next = ctx && ctx.normId != null && ctx.normId !== '' ? { normId: ctx.normId } : null;
    const prev = this._normContext$.value;
    if (prev?.normId === next?.normId) return;
    this._normContext$.next(next);
  }

  clearContext() {
    if (this._normContext$.value !== null) {
      this._normContext$.next(null);
    }
  }

  get normContext(): SamiNormContext | null {
    return this._normContext$.value;
  }
}
