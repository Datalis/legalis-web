import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { environment } from '@env/environment';
import { ConnectionStatus, Message } from './sami-chat.types';
import { SamiChatService } from './sami-chat.service';

export const WIDGET_VERSION = '1.0.12';

const COOKIE_USER_ID = 'samiChatUserId';
const STORAGE_USER_ID = 'chatUserId';
const STORAGE_IS_OPEN = 'samiChatIsOpen';
const STORAGE_MESSAGES = 'samiChatMessages';
const HINT_DELAY_MS = 5000;
const HINT_AUTOHIDE_MS = 10000;

@UntilDestroy()
@Component({
  selector: 'app-sami-chat',
  templateUrl: './sami-chat.component.html',
  styleUrls: ['./sami-chat.component.scss'],
})
export class SamiChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() initialMessage = '¡Hola! Soy SaMi, tu asistente legal de Legalis. Pregúntame sobre normativas, gacetas o cualquier consulta jurídica de Cuba.';
  @Input() backendUrl = environment.samiBackendUrl;
  @Input() legalMode = true;

  readonly version = WIDGET_VERSION;
  readonly avatarUrl =
    'https://imagedelivery.net/ue4aG0YFlZz5n2eXb6lOxg/bed9f7b7-3c14-4ffa-1da5-793ad3bbd100/public';
  readonly elToqueImageUrl =
    'https://imagedelivery.net/ue4aG0YFlZz5n2eXb6lOxg/b691e3fb-667f-414d-4a14-6db161fdb200/public';

  isOpen = false;
  isTyping = false;
  inputValue = '';
  connectionStatus: ConnectionStatus = 'disconnected';
  messages: Message[] = [];
  visibleCount = 10;
  showHint = false;
  bounceFab = false;
  readonly hintText = '¡Hola! ¿Tienes una duda legal?';

  private userId = '';
  private initialized = false;
  private readonly isBrowser: boolean;
  private eventSource: EventSource | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private isConnecting = false;
  private prevMessagesLength = 0;
  private shouldScroll = false;
  private typingWatchdog: ReturnType<typeof setTimeout> | null = null;
  private hintShowTimer: ReturnType<typeof setTimeout> | null = null;
  private hintHideTimer: ReturnType<typeof setTimeout> | null = null;

  @ViewChild('messagesEnd') messagesEnd?: ElementRef<HTMLDivElement>;
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
    private readonly samiChat: SamiChatService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    console.log(`🤖 SaMi Chat Widget v${WIDGET_VERSION}`);

    let id = this.getCookie(COOKIE_USER_ID) || localStorage.getItem(STORAGE_USER_ID);
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      this.setCookie(COOKIE_USER_ID, id, 365);
      localStorage.setItem(STORAGE_USER_ID, id);
    } else if (!this.getCookie(COOKIE_USER_ID)) {
      this.setCookie(COOKIE_USER_ID, id, 365);
    }
    this.userId = id;

    const savedIsOpen = localStorage.getItem(STORAGE_IS_OPEN);
    const savedMessages = localStorage.getItem(STORAGE_MESSAGES);

    if (savedMessages) {
      try {
        this.messages = this.sortMessages(JSON.parse(savedMessages));
      } catch {
        this.messages = [{ id: 1, role: 'assistant', content: this.initialMessage, createdAt: new Date().toISOString() }];
      }
    } else {
      this.messages = [{ id: 1, role: 'assistant', content: this.initialMessage, createdAt: new Date().toISOString() }];
    }
    this.prevMessagesLength = this.messages.length;

    this.initialized = true;

    if (savedIsOpen === 'true') {
      this.setOpen(true);
    }

    this.samiChat.toggle$.pipe(untilDestroyed(this)).subscribe((open: boolean) => this.setOpen(open));

    this.scheduleHint();
  }

  ngOnDestroy() {
    this.cleanupConnection();
    if (this.typingWatchdog) {
      clearTimeout(this.typingWatchdog);
      this.typingWatchdog = null;
    }
    this.cancelHint();
  }

  /* --------------------------------- HINT --------------------------------- */

  dismissHint() {
    this.showHint = false;
    this.bounceFab = false;
    if (this.hintHideTimer) {
      clearTimeout(this.hintHideTimer);
      this.hintHideTimer = null;
    }
  }

  private scheduleHint() {
    if (!this.isBrowser) return;
    if (this.isOpen) return;

    this.hintShowTimer = setTimeout(() => {
      this.hintShowTimer = null;
      if (this.isOpen) return;
      this.showHint = true;
      this.bounceFab = true;
      this.cdr.detectChanges();
      this.hintHideTimer = setTimeout(() => {
        this.hintHideTimer = null;
        this.bounceFab = false;
        this.showHint = false;
        this.cdr.detectChanges();
      }, HINT_AUTOHIDE_MS);
    }, HINT_DELAY_MS);
  }

  private cancelHint() {
    if (this.hintShowTimer) {
      clearTimeout(this.hintShowTimer);
      this.hintShowTimer = null;
    }
    if (this.hintHideTimer) {
      clearTimeout(this.hintHideTimer);
      this.hintHideTimer = null;
    }
    this.showHint = false;
    this.bounceFab = false;
  }

  ngAfterViewChecked() {
    if (!this.isBrowser || !this.initialized) return;

    if (this.messages.length > this.prevMessagesLength) {
      this.shouldScroll = true;
    }
    this.prevMessagesLength = this.messages.length;

    if (this.shouldScroll || this.isTyping) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  /* ------------------------------ UI HANDLERS ------------------------------ */

  toggle() {
    this.setOpen(!this.isOpen);
  }

  setOpen(open: boolean) {
    if (this.isOpen === open) return;
    this.isOpen = open;
    if (this.isBrowser && this.initialized) {
      localStorage.setItem(STORAGE_IS_OPEN, String(open));
    }
    if (open) {
      this.dismissHint();
      this.connect();
      setTimeout(() => this.scrollToBottom(), 100);
    } else {
      this.cleanupConnection();
    }
  }

  loadMore() {
    this.visibleCount += 10;
  }

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.send();
    }
  }

  send() {
    const text = this.inputValue.trim();
    console.log('[sami] send() called', {
      text,
      isTyping: this.isTyping,
      userId: this.userId,
      connectionStatus: this.connectionStatus,
      hasEventSource: !!this.eventSource,
      normContext: this.samiChat.normContext,
    });
    if (!text) {
      console.warn('[sami] send aborted: empty text');
      return;
    }
    if (this.isTyping) {
      console.warn('[sami] send aborted: isTyping=true is stuck');
      return;
    }
    if (!this.userId) {
      console.warn('[sami] send aborted: userId missing');
      return;
    }
    this.appendUserMessage(text);
    this.inputValue = '';
    this.ensureConnected();
    this.postChat(text);
  }

  sendQuick(text: string) {
    if (this.isTyping || !this.userId) return;
    this.appendUserMessage(text);
    this.ensureConnected();
    this.postChat(text);
  }

  private ensureConnected() {
    if (this.eventSource || this.isConnecting) return;
    // Drop any back-off lock so a user-triggered send can immediately retry SSE
    // even if we previously gave up after 5 failed attempts.
    this.reconnectAttempts = 0;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.connect();
  }

  trackById(_: number, message: Message) {
    return message.id;
  }

  /* ------------------------------- FEEDBACK ------------------------------- */

  sendFeedback(message: Message, value: boolean) {
    const id = message.feedbackMessageId || message.messageId;
    if (!id || message.feedback != null) return;

    this.messages = this.messages.map((m) =>
      m.messageId === id || m.feedbackMessageId === id ? { ...m, feedback: value } : m,
    );
    this.persistMessages();

    this.http
      .post(`${this.backendUrl}/api/feedback`, { messageId: id, value })
      .subscribe({ error: (err: unknown) => console.error('Error enviando feedback:', err) });
  }

  /* --------------------------- INTERNAL HELPERS --------------------------- */

  private appendUserMessage(text: string) {
    this.messages = this.sortMessages([
      ...this.messages,
      { id: Date.now(), role: 'user', content: text, createdAt: new Date().toISOString() },
    ]);
    this.setTyping(true);
    this.persistMessages();
  }

  /**
   * Sort messages chronologically. We use createdAt when present (real DB
   * timestamps from the backend) and fall back to the local id (Date.now()
   * for messages we authored) for those that don't have one. The sort is
   * stable, so consecutive messages with the same key keep their order.
   */
  private sortMessages(list: Message[]): Message[] {
    const keyed = list.map((m, idx) => ({ m, idx, key: this.sortKey(m) }));
    keyed.sort((a, b) => {
      if (a.key === b.key) return a.idx - b.idx;
      return a.key < b.key ? -1 : 1;
    });
    return keyed.map((x) => x.m);
  }

  private sortKey(m: Message): number {
    if (m.createdAt) {
      const t = Date.parse(m.createdAt);
      if (!Number.isNaN(t)) return t;
    }
    if (typeof m.id === 'number') return m.id;
    const parsed = Number(String(m.id).split('_')[0]);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Fallback dedupe key when messageId is missing or the backend redelivers
   * the same message with a different id/timestamp. For assistant messages
   * we fold by content alone — an assistant repeating the exact same reply
   * is overwhelmingly a duplicate, not an intentional repeat. For user
   * messages we key on the locally-assigned id (always unique), so a user
   * legitimately sending "ok" twice still produces two messages.
   */
  private fingerprint(m: Message): string {
    if (m.role === 'user') return `user::${m.id}`;
    return `assistant::${m.content.trim()}`;
  }

  private setTyping(value: boolean) {
    this.isTyping = value;
    if (this.typingWatchdog) {
      clearTimeout(this.typingWatchdog);
      this.typingWatchdog = null;
    }
    if (value && this.isBrowser) {
      this.typingWatchdog = setTimeout(() => {
        if (this.isTyping) {
          console.warn('[sami] typing watchdog: no response after 30s, unblocking input');
          this.isTyping = false;
          this.cdr.detectChanges();
        }
        this.typingWatchdog = null;
      }, 30000);
    }
  }

  private postChat(content: string) {
    const endpoint = this.legalMode ? '/api/legal-chat' : '/api/chat';
    const normCtx = this.samiChat.normContext;
    const body: Record<string, unknown> = {
      userId: this.userId,
      username: 'Web User',
      currentUrl: this.isBrowser ? window.location.href : '',
      messages: [{ role: 'user', content }],
    };
    if (normCtx?.normId != null && normCtx.normId !== '') {
      body['context'] = { normId: normCtx.normId };
    }
    this.http
      .post(`${this.backendUrl}${endpoint}`, body)
      .subscribe({
        error: (err: unknown) => {
          console.error(`POST ${endpoint} falló:`, err);
          this.setTyping(false);
          this.messages = this.sortMessages([
            ...this.messages,
            {
              id: Date.now(),
              role: 'assistant',
              content: '⚠️ No pude enviar tu mensaje. Intenta de nuevo en un momento.',
              createdAt: new Date().toISOString(),
            },
          ]);
          this.persistMessages();
          this.cdr.detectChanges();
        },
      });
  }

  private connect() {
    if (!this.isBrowser || !this.userId) return;
    if (this.eventSource || this.isConnecting) return;

    this.isConnecting = true;
    this.connectionStatus = 'connecting';

    try {
      const es = new EventSource(`${this.backendUrl}/api/stream/${this.userId}`);
      this.eventSource = es;

      es.onopen = () => {
        this.connectionStatus = 'connected';
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.cdr.detectChanges();
      };

      es.onmessage = (event) => this.handleSseEvent(event);

      es.onerror = () => {
        this.isConnecting = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        this.connectionStatus = 'disconnected';

        if (this.isOpen) {
          this.reconnectAttempts += 1;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          this.reconnectTimeout = setTimeout(() => this.connect(), delay);
        }
        this.cdr.detectChanges();
      };
    } catch (err) {
      console.error('Error creando SSE:', err);
      this.isConnecting = false;
      this.connectionStatus = 'disconnected';
    }
  }

  private handleSseEvent(event: MessageEvent) {
    if (!event.data || event.data.startsWith(':')) return;

    let data: any;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      console.error('❌ Error procesando SSE:', err);
      return;
    }

    if (data.type === 'typing' && data.isTyping === false) {
      this.setTyping(false);
      this.cdr.detectChanges();
      return;
    }

    if (data.type === 'pending_batch') {
      const batch: any[] = Array.isArray(data.messages) ? data.messages : [];
      const existingIds = new Set(this.messages.map((m) => m.messageId).filter(Boolean));
      const existingFingerprints = new Set(this.messages.map((m) => this.fingerprint(m)));

      const mapped: Message[] = batch.map((m: any) => ({
        id: m.messageId || `${Date.now()}_${Math.random()}`,
        messageId: m.messageId || null,
        createdAt: m.createdAt || null,
        role: m.role === 'admin' ? 'assistant' : m.role,
        content: m.content || '',
        image: m.image || undefined,
        preview: m.preview || null,
        requestFeedback: m.requestFeedback || false,
        feedbackMessageId: m.feedbackMessageId || null,
        feedback: typeof m.feedback === 'boolean' ? m.feedback : null,
      }));

      const deduped: Message[] = [];
      for (const m of mapped) {
        if (m.messageId && existingIds.has(m.messageId)) continue;
        const fp = this.fingerprint(m);
        if (existingFingerprints.has(fp)) continue;
        deduped.push(m);
        existingFingerprints.add(fp);
        if (m.messageId) existingIds.add(m.messageId);
      }
      deduped.forEach((m) => {
        if (m.messageId && m.role === 'assistant') this.sendAck(m.messageId);
      });

      this.messages = this.sortMessages([...this.messages, ...deduped]);
      this.setTyping(false);
      this.persistMessages();
      this.cdr.detectChanges();
      return;
    }

    if (data.type === 'message') {
      if (data.messageId && this.messages.some((m) => m.messageId === data.messageId)) {
        return;
      }
      const candidate: Message = {
        id: data.messageId || `${Date.now()}_${Math.random()}`,
        messageId: data.messageId || null,
        createdAt: data.createdAt || new Date().toISOString(),
        role: data.role,
        content: data.content || '',
        image: data.image || undefined,
        preview: data.preview || null,
        requestFeedback: data.requestFeedback || false,
        feedbackMessageId: data.feedbackMessageId || null,
      };
      const fp = this.fingerprint(candidate);
      if (this.messages.some((m) => this.fingerprint(m) === fp)) return;

      this.messages = this.sortMessages([
        ...this.messages,
        candidate,
      ]);

      if (data.messageId && data.role === 'assistant') this.sendAck(data.messageId);

      this.setTyping(false);
      this.persistMessages();
      this.cdr.detectChanges();
    }
  }

  private sendAck(messageId: string) {
    if (!messageId) return;
    this.http
      .post(`${this.backendUrl}/api/ack`, { messageId })
      .subscribe({ error: (err: unknown) => console.error('Error enviando ACK:', err) });
  }

  private cleanupConnection() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.connectionStatus = 'disconnected';
  }

  private persistMessages() {
    if (!this.isBrowser || !this.initialized) return;
    if (this.messages.length === 0) return;
    localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(this.messages));
  }

  private scrollToBottom() {
    const el = this.messagesContainer?.nativeElement;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }

  private setCookie(name: string, value: string, days = 365) {
    if (!this.isBrowser) return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    if (!this.isBrowser) return null;
    const nameEQ = `${name}=`;
    const parts = document.cookie.split(';');
    for (let p of parts) {
      while (p.charAt(0) === ' ') p = p.substring(1);
      if (p.indexOf(nameEQ) === 0) return p.substring(nameEQ.length);
    }
    return null;
  }
}
