import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  LOCALSTORAGE_KEY_OF_TOKEN: string = "JustOmok_token";
  token: string;
  
  constructor(private socket: Socket) {
    if (this.hasToken()) { this.token = localStorage.getItem(this.LOCALSTORAGE_KEY_OF_TOKEN) }
    // matched 는 서버에서 클라이언트로 쏴주는거 말고도 클라이언트에서도 서버로 쏴줘야한다. 서버측 isQueueing 갱신을 위해
    this.onMatched().subscribe((data:any) => {
      this.socket.emit("matched");
    });
  }

  register(nickName: string) {
    this.socket.fromOneTimeEvent("token").then((data:any) => {
      const token = data.token;
      localStorage.setItem(this.LOCALSTORAGE_KEY_OF_TOKEN, token);
     });
    this.socket.emit("register", { nickName });
  }
  hasToken() {
    return Boolean(localStorage.getItem(this.LOCALSTORAGE_KEY_OF_TOKEN));
  }
  queueStart() {
    this.socket.emit("queueStart", { token: this.token });
  }
  queueStop() {
    this.socket.emit("queueStop", { token: this.token });
  }
  onMatched() {
    return this.socket.fromEvent("matched");
  }
  sendChat(chat: string) {
    this.socket.emit("chat", { chat, token: this.token });
  }
  onChat() {
    return this.socket.fromEvent("chat");
  }
  sendPut(id:number) {
    this.socket.emit("put", { id });
  }
  onPut() {
    return this.socket.fromEvent("put");
  }
  sendPassTurn() {
    this.socket.emit("passTurn");
  }
  onGetTurn() {
    return this.socket.fromEvent("getTurn");
  }
  sendWin() {
    this.socket.emit("win");
  }
  onGameOver() {
    return this.socket.fromEvent("gameOver");
  }

}
