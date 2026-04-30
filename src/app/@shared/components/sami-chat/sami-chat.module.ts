import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamiChatComponent } from './sami-chat.component';
import { SamiContentPipe } from './sami-content.pipe';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SamiChatComponent, SamiContentPipe],
  exports: [SamiChatComponent],
})
export class SamiChatModule {}
