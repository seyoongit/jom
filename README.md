# Just Omok  

Angular를 공부하기위해 진행한 프로젝트이다.
<br>
유저간의 통신은 socket.io 를 사용하여 구현했고 서버에서 클라이언트를 기억하기 위한 방법으로는 간단하게 JWT를 사용했다.
<br>

### 구조

![jom_structure]()

<br>
크게 3개의 컴포넌트로 나뉜다. TopNav와 Footer는 그냥 자리만 차지하고 별 기능없으므로 다루지 않는다.  <br>
<br>

### Service

컴포넌트를 설명하기 앞서 먼저 서비스부터 짚고 넘어가야 겠다.  <br>
<br>
직접 작성한 서비스는 소켓 통신을 다루는 socket.service.ts 하나밖에 없다.  <br>
socket.io를 Angular에 맞게 포팅한 라이브러리인 ngx-socket-io 라는걸 사용했다.  <br>
<br>

![jom_socketEvent]()

각각의 이벤트를 설명하자면 다음과 같다. <br>

> register & token  <br>

맨 처음 사이트에 접속하게 되면 닉네임을 묻는 모달창이 뜬다.  <br>
닉네임이 입력되면 register 이벤트를 발송하는데 이에 대한 답장으로 서버는 token 이벤트에 JWT 토큰을 담아서 보내준다.  <br>
클라이언트는 JWT 토큰을 받아서 로컬스토리지에 저장한다.  <br>
<br>
이후 사용자의 모든 요청에는 이 토큰을 같이 보내게 되며, 서버는 토큰을 검증한뒤 올바른 토큰일 경우에만 답신을 한다. 검증에 실패할경우 그냥 무시한다.
딱히 토큰의 사용기한이라던가 refresh 관련 구현은 없다. 그냥 받아서 영원히(사용자가 직접 지우지 않는한) 저장한다.  <br>
<br>

> queueStart & queueStop  <br>

닉네임을 등록한다음엔 큐를 돌리는 모달창이 뜬다.  <br>
게임시작! 버튼을 누르면 queueStart를 발송하며, 서버는 사용자의 소켓 아이디를 대기자큐에 추가한다.  <br>
서버의 대기자큐는 힙으로 구현했는데 자세한 내용은 밑에서 더 설명하겠다.  <br>

게임시작! 버튼을 또 누르면 queueStop을 발송하며, 서버는 사용자의 소켓 아이디를 '닷지한사람' 큐에 추가한다.  <br>
'닷지한사람' 큐 역시 힙으로 구현되어있다.

> disconnect  <br>

사용자가 브라우져를 그냥 꺼버리거나 하면 disconnect 이벤트가 발생한다.  <br>
이 경우 케이스가 두갈래로 나뉘는데  <br>
1. 게임은 아직 시작하지 않았지만 큐를 돌리던 중이었다면 '닷지한사람' 큐에 해당 소켓의 아이디를 추가한다.  <br>
2. 게임이 진행되던 도중이면 상대방에게 '당신이 이겼다' 라는 이벤트를 보낸다. 이걸 받은 상대방 클라이언트는 "상대방이 탈주했습니다" 라는 메세지와 함께 승리했다는 모달을 띄운다.  <br>
그리고 그림엔 안나와 있지만 큐를 돌리던중도 아니고 게임을 하던중도 아니라면 그냥 아무동작도 하지 않는다.  <br>

> put  <br>
오목판의 돌을 놓을때 발생하는 이벤트이다.  <br>
A와 B가 게임을 하는데, A 차례가 되서 A가 오목판에 수를 두면 A의 클라이언트는 해당 자리에 자신의 돌(파란색돌)을 놓은다음 put 이벤트를 발송한다.  <br>
서버는 이를 수신한뒤 그대로 상대편인 B에게 put 을 보내준다.  <br>
B의 클라이언트가 put을 수신받으면 해당위치에 상대편의 돌(빨간색돌)을 놓는다.  <br>

> passTurn & getTurn  <br>
put 과 같다. 본인 차례가 되서 오목판에 수를 두면 put 이벤트 말고도 passTurn을 발송한다.  <br>
getTurn을 수신받은 상대방은 이제 본인의 수를 둘수 있다.  <br>

> win & gameOver  <br>
한 수를 둘때마다 본인이 게임이 이겼는지 졌는지 체크하게 되는데 이겼을경우 win을 발송한다.  <br>
이를 수신받은 서버는 양 클라이언트에 gameOver를 발송하는데, 여기에는 승리인지 패배인지 알려주는 데이터도 같이 보내진다.  <br>
엄밀히 말하면 어떤 못된 사용자가 직접 클라이언트 소스코드를 조작해서 win 이벤트를 보내버리면 그 자리에서 그냥 이겨버리는 치팅을 시도 할 가능성이 있긴 하나, 어짜피 많이 이긴다고 보상이 있는것도 아니고 그런 실력자가 이런 조그만 토이프로젝트까지 와서 그런일을 벌이진 않을거라고 생각되기 때문에 관련 대응은 생략한다.  <br>
경기의 승패를 서버가 아닌 클라이언트측에서 처리한다는 점도 같은 맥락에서 그냥 넘어가기로 한다.  <br>

> chat  <br>
말 그대로 채팅 이벤트이다.  <br>
클라이언트 측에서는, 내 메세지는 ui에 직접 그리고 상대방의 메세지만 chat이벤트로 수신받아 ui에 그리게 된다.  <br>


###### Board  

<br>
게임 기능의 핵심이 되는 Board
