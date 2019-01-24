import { Component, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SocketService } from "../socket.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements AfterViewInit {
  input: string = "";
  isQueueing: boolean = false;
  hasToken: boolean = false;
  
  constructor(
    private messageService: MessageService,
    private socketService: SocketService
    ) {
      // hasToken 은 컴포넌트가 렌더링 되기전에 미리 선언되있어야 하기 때문에 여기에 위치한다. 안그러면 새로고침을 해도 닉네임 등록 모달창만 뜬다.
      this.hasToken = this.socketService.hasToken()
    }
  
  onKey(e) {
    this.input = this.input.slice(0,25); // 닉네임 글자수 제한
    if (e.keyCode === 13) {
      const nickName = e.target.value;
      this.register(nickName);
      this.clear("modal");
    }
  }
  register(nickName: string) {
    this.socketService.register(nickName);
    setTimeout(() => {
      location.reload(false) // 원래는 *ngIf 를 이용하여 hasToken에 따라 p-toast 내부에서 보여줄 템플릿을 결정하게끔 코딩했으나 hasToken이 변경됬는데도 앵귤러가 반응을 안해서 그냥 새로고침을 해버린다 
    }, 700);
  }
  showModal() {
    this.clear("modal")
    this.messageService.add({ key: "modal", severity: 'info', summary:"", detail:"", sticky: true});
  }
  pushMessage(title, message) {
    this.messageService.add({ key: "push", severity: 'info', summary: title, detail: message});
  }
  clear(key) {
    this.messageService.clear(key);
  }
  queueStart() {
    this.isQueueing = true;
    this.socketService.queueStart();
  }
  queueStop() {
    this.isQueueing = false;
    this.socketService.queueStop();
  }
  ngAfterViewInit() {
    // ngOnInit 을 사용하면 모달창이 안뜬다. 그래서 ngAfterViewInit 사용
    this.showModal();

    this.socketService.onMatched().subscribe(() => {
      this.isQueueing = false;
      this.clear("modal");
    });

    this.socketService.onGameOver().subscribe((data:any) => {
      const { win, message } = data; 
      if (win) { this.pushMessage("You Win!", message); }
      else { this.pushMessage("You Lose...", message); }
      this.showModal();
    });

    this.socketService.onGetTurn().subscribe((data:any) => {
      this.pushMessage("Now your turn!", "");
    });
  }
}
