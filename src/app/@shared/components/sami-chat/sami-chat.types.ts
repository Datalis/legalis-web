import { SafeHtml } from '@angular/platform-browser';

export interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  source?: string;
}

export interface Message {
  id: number | string;
  messageId?: string | null;
  createdAt?: string | null;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  preview?: LinkPreview[] | null;
  requestFeedback?: boolean;
  feedbackMessageId?: string | null;
  feedback?: boolean | null;
}

export interface ContentBlock {
  kind: 'html' | 'link' | 'image' | 'eltoque';
  html?: SafeHtml;
  url?: string;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';
