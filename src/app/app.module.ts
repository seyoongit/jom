import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AppComponent } from './app.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { BoardComponent } from './board/board.component';
import { FooterComponent } from './footer/footer.component';
import { ChatComponent } from './chat/chat.component';
import { ModalComponent } from './modal/modal.component';
import { SocketService } from './socket.service'

const config: SocketIoConfig = { url: "http://localhost:8080", options: {} };

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    BoardComponent,
    FooterComponent,
    ChatComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressSpinnerModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [MessageService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
