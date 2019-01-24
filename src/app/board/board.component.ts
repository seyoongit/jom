import { Component, OnInit } from '@angular/core';
import { SocketService } from "../socket.service";

interface Stone {
  id: number;
  state: string; // "empty" || "me" || "enemy"
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  stones: Array<Stone> = [];
  stoneStyle = {
    "border-radius": "10px",
    "height": "10px",
  };
  myTurn: boolean = false;
  
  constructor(private socketService: SocketService) { }

  onClick(id:number) {
    if (!this.myTurn) return
    if (this.stones[id].state !== "empty") return
    this.stones[id].state = "me";
    this.socketService.sendPut(id);
    this.socketService.sendPassTurn();
    this.myTurn = false;
    if (this.checkWin()) {
      this.socketService.sendWin();
    }
  }
  checkWin() {
    let win = 0;
    // 오목판 크기는 12x12
    for (let y=0; y<12; y++){
      for (let x=0; x<12; x++) {
        const id = y*12 + x;
        if (this.stones[id].state !== "me") continue
        let garo=x<8, sero=y<8, diagonal1=x<8 && y<8, diagonal2=x>3 && y<8;
        // 5목 체크
        for (let i=0; i<5; i++) {
          if (x<8 && this.stones[id+i].state !== "me") garo = false;  // →
          if (y<8 && this.stones[id+i*12].state !== "me") sero = false; // ↓
          if (x<8 && y<8 && this.stones[id+i*13].state !== "me") diagonal1 = false;  // ↘
          if (x>3 && y<8 && this.stones[id+i*11].state !== "me") diagonal2 = false; // ↙
        }
        // 6목 체크
        if (garo) {
          let leftOk=false, rightOk=false;
          if (x===0 || this.stones[id-1].state !== "me") leftOk = true;
          if (x > 6 || this.stones[id+5].state !== "me") rightOk = true;
          if (!leftOk || !rightOk) garo = false;
        }
        if (sero) {
          let topOk=false, bottomOk=false;
          if (y===0 || this.stones[id-12].state !== "me") topOk = true;
          if (y > 6 || this.stones[id+60].state !== "me") bottomOk = true;
          if (!topOk || !bottomOk) sero = false;
        }
        if (diagonal1) {
          let topLeftOk=false, bottomRightOk=false;
          if (x===0 || y===0 || this.stones[id-13].state !== "me") topLeftOk = true;
          if (x > 6 || y > 6 || this.stones[id+65].state !== "me") bottomRightOk = true;
          if (!topLeftOk || !bottomRightOk) diagonal1 = false;
        }
        if (diagonal2) {
          let topRightOk=false, bottomLeftOk=false;
          if (x===11 || y===0 || this.stones[id-11].state !== "me") topRightOk = true;
          if (x < 5  || y > 6 || this.stones[id+55].state !== "me") bottomLeftOk = true;
          if (!topRightOk || !bottomLeftOk) diagonal2 = false;
        }
        if (garo || sero || diagonal1 || diagonal2) return true
      }
    }
    return false
  }
  ngOnInit() {
    for (let i=0; i<144; i++) {
      this.stones.push({ id: i, state: "empty" });
    }

    // 한 stone 의 길이를 얻기위한 몽키패치
    setTimeout(() => {
      const stoneLength = document.getElementById("stone-0").clientWidth;
      this.stoneStyle.height = this.stoneStyle["border-radius"] = `${stoneLength}px`;
    }, 200);

    this.socketService.onPut().subscribe((data:any) => {
      const { id } = data;
      this.stones[id].state = "enemy";
    });

    this.socketService.onGetTurn().subscribe(() => {
      this.myTurn = true;
    });

    this.socketService.onMatched().subscribe(() => {
      for (let stone of this.stones) {
        stone.state = "empty";
      }
    })
  }
}
