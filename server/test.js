stones = []
for (let a=0; a<144; a++) {
    stones.push({ state: "empty" })
}
stones[7].state = "enemy"
stones[8].state = "me"

function checkWin() {
    let win = 0;
    // 오목판 크기는 12x12
    for (let y=0; y<12; y++){
      for (let x=0; x<12; x++) {
        const id = y*12 + x;
        if (this.stones[id].state !== "me") continue
        let garo=x<8, sero=y<8, diagonal1=x<8 && y<8, diagonal2=x>3 && y<8;
        // 5목 체크
        for (let i=0; i<5; i++) {
          if (this.stones[id+i].state !== "me") garo = false;  // →
          if (this.stones[id+i*12].state !== "me") sero = false; // ↓
          if (this.stones[id+i*13].state !== "me") diagonal1 = false;  // ↘
          if (this.stones[id+i*11].state !== "me") diagonal2 = false; // ↙
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

console.log(checkWin())