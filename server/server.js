const app = require("express")();
// app.use(require("morgan")("short"));
// app.use(require("cors")());
const http = require("http").Server(app);
const io = require("socket.io")(http)
http.listen(8080)

const jwt = require("jsonwebtoken");
const JWT_SECRET = "IU";

const heapq = require("heapq");
const Q = [];
const dodge = [];
io.on("connection", socket => {
    socket.timestamp = Date.now();
    socket.isQueueing = false;
    socket.room = null;

    socket.on("register", data => {
        const { nickName } = data;
        token = jwt.sign({ nickName }, JWT_SECRET);
        socket.emit("token", { token });
    });
    
    socket.on("queueStart", data => {
        const decoded = verify(data.token);
        if (!decoded) { socket.disconnect(); return }
        const { nickName } = decoded;
        //매치
        if (Q.length > 0) {
            let [, enemyId, enemyNickName] = Q.pop();
            while (dodge.length > 0 && enemyId === heapq.top(dodge)[1]) {
                heapq.pop(dodge);
                if (Q.length > 0 === false) {
                    enemyId = null;
                    break
                }
                enemyId = Q.pop().id;
                continue
            }
            if (enemyId === null) { // 방잡고 기다림
                heapq.push(Q, [socket.timestamp, socket.id, nickName])
                socket.room = socket.id
                socket.isQueueing = true;
                return 
            }
            socket.join(enemyId);
            socket.room = enemyId
            io.to(enemyId).emit("matched");
            socket.emit("getTurn");
        } else { // 방잡고 기다림
            socket.join(socket.id);
            socket.room = socket.id
            heapq.push(Q, [socket.timestamp, socket.id, nickName])
            socket.isQueueing = true;
        }
    });
    
    socket.on("matched", data => {
        // matched 는 서버에서 클라이언트로 쏴주는거 말고도 클라이언트에서도 서버로 쏴줘야한다. 서버측 isQueueing 갱신을 위해
        socket.isQueueing = false;
    });
    
    socket.on("queueStop", data => {
        const decoded = verify(data.token);
        if (!decoded) { socket.disconnect(); return }
        heapq.push(dodge, [socket.timestamp, socket.id]);
        socket.isQueueing = false;
    });
    
    socket.on("chat", data => {
        const { chat, token } = data;
        const decoded = verify(token);
        if (!decoded) { socket.disconnect(); return }
        const { nickName } = decoded;
        socket.to(socket.room).emit("chat", { chat, enemyNickName: nickName });
    });
    
    socket.on("put", data => {
        const { id } = data;
        socket.to(socket.room).emit("put", { id });
    });
    
    socket.on("passTurn", () => {
        socket.to(socket.room).emit("getTurn");
    });
    
    socket.on("win", () => {
        socket.emit("gameOver", { win: true, message: winMessage() });
        socket.to(socket.room).emit("gameOver", { win: false, message: loseMessage() });
        socket.leaveAll();
    });
    
    socket.on("disconnect", data => {
        // 예기치 않게 연결이 끊기면 data 인자에는 "transport close" 라는 스트링이 전달된다
        // 클라이언트에서 socket.disconnect() 해서 끊는 경우에는 "client namespace disconnect" 스트링이 전달된다
        if (data === "transport close" && socket.isQueueing) {
            heapq.push(dodge, [socket.timestamp, socket.id]);
        }
        socket.to(socket.room).emit("gameOver", { win: true, message: "상대방이 탈주했습니다" });
        socket.leaveAll();
    });
})
function verify(token) {
    let decoded = null;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    }
    catch (e) {
        return null;
    }
    finally {
        return decoded;
    }
};
function winMessage() {
    message = ["GG", "너무 쉬워", "한번 이긴걸론 부족하지!", "수준에 맞는 적수가 없는걸?", "게임을 하면 이겨야지!", "뭐 별거 아니군"]
    return message[Math.floor(Math.random()*300 % message.length)]
};
function loseMessage() {
    message = ["GG", "아직 포기할때가 아니야", "이럴 때도 있는거지 뭐", "액땜 한셈 치자고", "막상막하 였는데!", "다시 해보자"]
    return message[Math.floor(Math.random()*300 % message.length)]
};