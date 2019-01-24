import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SocketService } from "../socket.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  input: string = "";

  constructor(
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  addMyChat(chat: string): void {
    // 내 메세지는 info 상대방 메세지는 warn
    this.messageService.add({key: "chat", severity: 'info', summary: "나", detail: chat, life: 5000 });
  }
  addEnemyChat(chat: string, enemyNickName: string) {
    this.messageService.add({key: "chat", severity: 'warn', summary: enemyNickName, detail: chat, life: 5000 });
  }
  onKey(e): void {
    const chat = this.input;
    if (e.keyCode === 13 && chat !== "") {
      this.addMyChat(chat);
      this.socketService.sendChat(chat);
      this.input = "";
    }
  }
  ngOnInit() {
    this.socketService.onChat().subscribe((data:any) => {
      const { chat, enemyNickName } = data;
      this.addEnemyChat(chat , enemyNickName);
    });
  }
}
