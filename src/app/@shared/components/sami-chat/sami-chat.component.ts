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

@UntilDestroy()
@Component({
  selector: 'app-sami-chat',
  templateUrl: './sami-chat.component.html',
  styleUrls: ['./sami-chat.component.scss'],
})
export class SamiChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() initialMessage = '¡Hola! Soy SaMi, tu asistente de elTOQUE. ¿En qué puedo ayudarte hoy?';
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

  private userId = '';
  private initialized = false;
  private readonly isBrowser: boolean;
  private eventSource: EventSource | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private isConnecting = false;
  private prevMessagesLength = 0;
  private shouldScroll = false;

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
        this.messages = JSON.parse(savedMessages);
      } catch {
        this.messages = [{ id: 1, role: 'assistant', content: this.initialMessage }];
      }
    } else {
      this.messages = [{ id: 1, role: 'assistant', content: this.initialMessage }];
    }
    this.prevMessagesLength = this.messages.length;

    this.initialized = true;

    if (savedIsOpen === 'true') {
      this.setOpen(true);
    }

    this.samiChat.toggle$.pipe(untilDestroyed(this)).subscribe((open: boolean) => this.setOpen(open));
  }

  ngOnDestroy() {
    this.cleanupConnection();
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
    if (!text || this.isTyping || !this.userId) return;
    this.appendUserMessage(text);
    this.inputValue = '';
    this.postChat(text);
  }

  sendQuick(text: string) {
    if (this.isTyping || !this.userId) return;
    this.appendUserMessage(text);
    this.postChat(text);
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
    this.messages = [
      ...this.messages,
      { id: Date.now(), role: 'user', content: text },
    ];
    this.isTyping = true;
    this.persistMessages();
  }

  private postChat(content: string) {
    const endpoint = this.legalMode ? '/api/legal-chat' : '/api/chat';
    const ctx = this.samiChat.context;
    const payloadContent = ctx
      ? `[Contexto: el usuario está consultando la norma "${ctx}". Si pregunta por "esta norma", "este decreto", "esta ley" u otra referencia ambigua, asume que se refiere a esa.]\n\n${content}`
      : content;
    this.http
      .post(`${this.backendUrl}${endpoint}`, {
        userId: this.userId,
        username: 'Web User',
        currentUrl: this.isBrowser ? window.location.href : '',
        messages: [{ role: 'user', content: payloadContent }],
      })
      .subscribe({
        error: (err: unknown) => console.warn(`POST ${endpoint} falló:`, err),
      });
  }

  private connect() {
    if (!this.isBrowser || !this.userId) return;
    if (this.eventSource || this.isConnecting) return;

    if (this.reconnectAttempts >= 5) {
      this.connectionStatus = 'disconnected';
      this.messages = [
        ...this.messages,
        { id: Date.now(), role: 'assistant', content: '❌ No se pudo conectar con el servidor.' },
      ];
      this.persistMessages();
      return;
    }

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

        if (this.isOpen && this.reconnectAttempts < 5) {
          this.reconnectAttempts += 1;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
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
      this.isTyping = false;
      this.cdr.detectChanges();
      return;
    }

    if (data.type === 'pending_batch') {
      const batch: any[] = Array.isArray(data.messages) ? data.messages : [];
      const existingIds = new Set(this.messages.map((m) => m.messageId).filter(Boolean));

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

      const deduped = mapped.filter((m) => !m.messageId || !existingIds.has(m.messageId));
      deduped.forEach((m) => {
        if (m.messageId && m.role === 'assistant') this.sendAck(m.messageId);
      });

      this.messages = [...this.messages, ...deduped];
      this.isTyping = false;
      this.persistMessages();
      this.cdr.detectChanges();
      return;
    }

    if (data.type === 'message') {
      if (data.messageId && this.messages.some((m) => m.messageId === data.messageId)) {
        return;
      }

      this.messages = [
        ...this.messages,
        {
          id: data.messageId || `${Date.now()}_${Math.random()}`,
          messageId: data.messageId || null,
          createdAt: data.createdAt || null,
          role: data.role,
          content: data.content || '',
          image: data.image || undefined,
          preview: data.preview || null,
          requestFeedback: data.requestFeedback || false,
          feedbackMessageId: data.feedbackMessageId || null,
        },
      ];

      if (data.messageId && data.role === 'assistant') this.sendAck(data.messageId);

      this.isTyping = false;
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
