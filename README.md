# Just Omok  

Angular를 공부하기위해 진행한 프로젝트이다.
<br>
유저간의 통신은 socket.io 를 사용하여 구현했고 서버에서 클라이언트를 기억하기 위한 방법으로는 간단하게 JWT를 사용했다.
<br>

### 구조

![jom_structure](https://lh3.googleusercontent.com/t54OEPmAw9J4HRNXmkAy4VZTzyqOZ3X-zd8f-sdsnAZIhd1ivFrKpG1XiPYV_qonit9n8dl3Iq5GBugYqzK12qpyd-nr_EutQdxX5XzQhBApESHGM28QVJHpjXjSoHC8t03n5c5ud0UtQiJJ7sXaEDIu_NFKucfG9Rvn6sn8tn_HX8Fqhizb9Esfo8oCLSgsYcl7yksSE6FrO2EBclssLgbbFZTHHQsZ8soDN7d1-QbTLiLbWNk_0xidS4Rb5K0H3zRpiaNb82-9_Bxc0FcSwBChF0h9w8Av5nOoNcQInDIbzQhZZ7U0HgX1jjgZvlRTJ5J7wVTdgacCvCM3XxKZFXnXf0EwRy98Er-EENUXJX3kL0R-f_eYMNFzaS0p-xeHzDOD9ha0n-O3rOy6azbkwSyJSvZmCWYstXK5V8tLKped4fIEgYY9pmwWaJb9UZsZh3sjtL-4mvpTAcc81PQnvIxUi_zzPvpLASCJ8Vslv8rVnWTjMF54bJnX7ln2ZDOXZE06Vz7eRqKT7QzPMp8MC4c0Hie83RYxP_8_L8fvqKkBJo1gOdeTxTSM3TloqY6VCMWLnS4h0gzdJjDYInqSf8FpeXQJ4PlwWZkkVDRiK4zq-s-IpACdQJ31O8os4gmqIOXDaVLayKRlEtXko-P5joMM=w806-h626-no)

<br>
그림상엔 컴포넌트가 5개지만 TopNav와 Footer는 자리만 차지하고 사실상 아무기능도 안하기 때문에 주로 일하는 컴포넌트는 Board, Chat, Modal 3개이다.   
<br>
<br>

### Service

앱에서 사용되는 서비스에 대해서만 설명하면 앱을 전체적으로 파악하는데 충분하다고 생각하기 때문에 서비스만 알아본다  <br>
<br>
앱에서 사용되는 서비스중 내가 직접 작성한건 소켓 통신을 다루는 socket.service.ts 하나밖에 없다.  <br>
이를위해 socket.io를 Angular에 맞게 포팅한 라이브러리인 ngx-socket-io 라는걸 사용했다.  <br>
<br>

![jom_socketEvent](https://lh3.googleusercontent.com/GRPSClDJftB0Ii_inAeMgHWW-9g6Vv6nZRWwi3y3Sa4p43bvZhY-NN1ANdIzYQrnQQfuPhbM6NQaHBbURxIP05d4u58ALThewjx8zM4GzU_QO_a6LtlzZzXe0-Bo_3dGG63ez5L3hKlpZO6ZR-GwaO58mzhz7-dCkW49QdFbTCNqo9ZQKeAvUODjdlotILrWyhIEBkVWSXxcFGQ-zZLSof_U5ybFjKt4GVjoWV92snZG7ECiB0iMC2GErVVxoRGNdaMbVjM6mi5EOo3LISAmK7feXGv-FryKrd1zQBZjZgEBA9u4Er-KcfgW9za-qDVuit59k3MZo-dJP-ABurY9oe_3EbK0aLC9-LMxN0cLl0P68PbflPfyYWBeReZi9nAv1r9C2ZJmXwKwEx5m-gsxquFBYR_U5p2DUT1Hghcs_wq18NI8WRi3_hmMrEYV9vJW5mnG7_ovcuVUb6KqzH4LiCy9HXA05E2ukcEJjlDLZDWGb9gf8H3SNJXbfBX6JaVaN4Qe7dceGEqDru-2GJVt_gwWqmlV-J9vXCDKK7aDsrWcFL6WY8UDKbqb0a5uCoFHX5q_WR3Kji52JbmROyUxgVbUMjv28UgwSunM_wAuTZBfE9dWuYv-yHkI2bZXZBpgAUmE9mEip9DJ0tvJNQD-mpMK=w664-h626-no)

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
게임시작! 버튼을 누르면 queueStart를 발송하며, 서버는 플레이어를 대기자큐에 추가한다.  <br>
서버의 대기자큐는 힙으로 구현했는데 자세한 내용은 밑에서 더 설명하겠다.  <br>
<br>
게임시작! 버튼을 또 누르면 queueStop을 발송하며, 서버는 플레이어를 '닷지한사람' 큐에 추가한다.  <br>
'닷지한사람' 큐 역시 힙으로 구현되어있다.
<br>

> disconnect  <br>

사용자가 브라우져를 그냥 꺼버리거나 하면 disconnect 이벤트가 발생한다.  <br>
이 경우 케이스가 두갈래로 나뉘는데  <br>
<br>
1. 게임은 아직 시작하지 않았지만 큐를 돌리던 중이었다면 '닷지한사람' 큐에 해당 플레이어를 추가한다.  <br>
2. 게임이 진행되던 도중이면 상대방에게 '당신이 이겼다' 라는 이벤트를 보낸다. 이걸 받은 상대방 클라이언트는 "상대방이 탈주했습니다" 라는 메세지와 함께 승리했다는 모달을 띄운다.  <br>
<br>
그리고 그림엔 안나와 있지만 큐를 돌리던중도 아니고 게임을 하던중도 아니라면 그냥 아무동작도 하지 않는다.  <br>
<br>

> put  <br>

오목판의 돌을 놓을때 발생하는 이벤트이다.  <br>
A와 B가 게임을 하는데, A 차례가 되서 A가 오목판에 수를 두면 A의 클라이언트는 해당 자리에 자신의 돌(파란색돌)을 놓은다음 put 이벤트를 발송한다.  
<br>
서버는 이를 수신한뒤 그대로 상대편인 B에게 put 을 보내준다.  <br>
B의 클라이언트가 put을 수신받으면 해당위치에 상대편의 돌(빨간색돌)을 놓는다.  <br>
<br>

> passTurn & getTurn  <br>

put 과 같다. 본인 차례가 되서 오목판에 수를 두면 put 이벤트 말고도 passTurn을 같이 발송한다.  <br>
getTurn을 수신받은 상대방은 이제 본인의 수를 둘수 있다.  <br>
<br>

> win & gameOver  <br>

한 수를 둘때마다 본인이 게임이 이겼는지 졌는지 체크하게 되는데 이겼을경우 win을 발송한다.  <br>
이를 수신받은 서버는 양 클라이언트에 gameOver를 발송하는데, 여기에는 승리인지 패배인지 알려주는 데이터도 같이 보내진다.   <br>
<br>  
엄밀히 말하면 어떤 못된 사용자가 직접 클라이언트 소스코드를 조작해서 win 이벤트를 보내버리고 그 자리에서 그냥 이겨버리는 치팅을 시도 할 가능성이 없진 않으나, 어짜피 많이 이긴다고 어떤 보상이 있는것도 아니고 그런 실력자가 이런 조그만 토이프로젝트까지 와서 그런일을 벌이진 않을거라고는 생각되지  때문에 관련 대응은 생략한다.  <br>
<br>
경기의 승패를 서버가 아닌 클라이언트측에서 처리한다는 점도 같은 맥락에서 그냥 넘어가기로 했다.  <br>
<br>

> chat  <br>

말 그대로 채팅 이벤트이다.  <br>
<br>
클라이언트는 나의 메세지는 ui에 직접 그리고 상대방의 메세지만 chat이벤트로 수신받아 ui에 그린다.  <br>
<br>

> matched  <br>

그림에는 안나왔지만 matched 이벤트가 있다.  <br>
<br>
게임이 잡히고 상대방이 정해지면 서버에서 클라이언트로 matched가 발송되며, matched를 수신받은 클라이언트는 큐를 잡고있는 상태인지 아닌지를 표현하는 'isQueueing' 프로퍼티를 true에서 false로 바꾼다.  <br>
<br>
<br>

### Extra Freature  

###### 대기자큐와 닷지큐

![waitQ_dodgeQ](https://lh3.googleusercontent.com/kTJOxJIvDpz6zNrqc7w16FEYc7ErjW70Es9M-l73ePOgQAGp-uyaX-k0-EpdrlTEmbXSuPWWvx12hjOFByou42e3RWfPgRlZzq8TjoK4Lbtyvwky4TwKAkbxndiBLjzoPVYSzO9fO9mEELN151I23ceqjWkAhUqKM6ieyHyMh1g42-j0yfaOQiIymw405uc2MIsgXauJctzLtt9N7ru-7FsPzPwAyrB0t0VCv9n6wtq6zCJtILf8n_huo5THSo9pKv-6X0iE12c3zPL5HeRohhIUJg3yC3ldHKzu5Kip1qXSYPaB0v-Ec59-eHIwp27vvntQ0y1yTtF8wGOlFMTs6xT3jpOI9jUlaEg24xm4YU122O6r6l9Z70VOmwxgtCJBUP3Kjd1gzit0oOKRH26j0j3LQdk0P_NpBCBLWOITbInZUnnmjuLbjX650qONIvVF4o8YElhmtGchEk_6TJtojOti2pxt0LEPYOn9f8awdv6cvt_nUcEJzt9zu0akVDTuSa1T94SYzE_IDPPLDlGnW4u3qJxrq-EH72FqnodHj6hqdCImNaeFifhuF8tEIq1_NuqnrpPhykQMTxyWvkslBhY8gDjzERiX-40Ss8oYVdKYIeEKADgVB5CvPeSs_Jzc_TJJ8HOKiDqs-f0cuWhgb7sn=w728-h406-no)

1:1 게임이기 때문에 그림과 같이 복잡한 구조의 자료구조들은 사실 이론상 필요가 없다. 그냥 '대기자' 변수 하나만 둔다음  <br>
1. 사용자 A가 게임시작! 버튼을 누르면 A의 소켓 아이디를 '대기자' 변수에 할당한다.  <br>
2. 이후 사용자 B가 게임시작! 버튼을 누르면 A와 B를 매치시키고 '대기자' 변수에는 null 을 할당해서 비운다.  <br>
<br>
이 두가지 과정을 반복하기만 하면 충분하다.  <br>
하지만 실제 서비스에서는 타이밍이 어떻게 꼬일지 모르기 때문에 좀더 넉넉하게 처리할수 있게끔 우선순위 큐를 사용했다.  <br>
<br>
과정은 다음과 같다.  <br>
1. 일단 소켓이 서버와 처음 연결되면 서버는  Date.now() 로 해당 소켓에 타임스탬프를 할당한다.  <br>
그림상에 보이는 숫자가 바로 이 타임스탬프이며 우선순위큐(heap)은 이 타임스탬프를 기준으로 정렬한다.  <br>
<br>
2. 어떤 사용자가 게임시작! 을 누르면 대기자큐에서 pop으로 하나 빼서 매치시킨다.  <br>
<br>
3. 큐가 비었을 경우엔 큐에 [socket.timestamp, socket.id] 를 추가하는 방식이다.   <br>
<br>
문제는 큐를 돌리는 중에 닷지를한 경우이다.  <br>
사용자가 의도적으로 닷지하지 않았더라도 정전으로 브라우져가 그냥 꺼지거나 하는 돌발상황은 충분히 있을 수 있다.  <br>
<br>
이를 처리하기위해 '닷지큐' 가 필요하다.  <br>
위의 '소켓 이벤트' 항목에서도 설명했듯이 사용자가 큐잡기를 중단하거나 연결이 끊기면 닷지큐에 해당 소켓의 아이디가 추가된다.  <br>
<br>
이후 어떤 사용자가 게임시작! 버튼을 눌러서 큐를 잡기 시작하면 서버는 대기자 큐에서 플레이어를 하나를 꺼내는데, 이 플레이어가 닷지큐 루트의 플레이어와 같다면 얘는 상쇄되고 매치시키지 않는다. 이미 닷지한 플레이어기 때문이다.  <br>
<br>
위에서 말했듯 힙의 정렬은 타임스탬프를 기준으로 하기 때문에  <br> 

*대기자 큐에서 뽑은 플레이어가 이미 닷지한 플레이어인데, 얘가 닷지큐 루트의 플레이어와 다른사람인 경우는 없다*  <br>
즉 닷지한 플레이어는 무조건 닷지큐에 의해 상쇄된다.  <br>
<br>
그림상에는 설명을 위해 내용물이 주렁주렁 달려있는걸로 묘사했지만 실제 서버에서는 '큐에 내용물이 1개만 있거나' 혹은 '큐가 비었거나' 두가지 상태밖에 없다. 위에서 말했듯이, 애초에 이론상으론 변수 하나만으로 충분하기 때문이다.  <br>
<br>
<br>

###### JWT

서버가 사용자가 누구인지 기억하는 방법으로는 세션이나 쿠키가 아닌 JWT를 사용한다.  <br>
사실 서버가 기억해야하는 데이터라고는 '닉네임' 하나밖에 없긴 하지만 JWT 공부도 할겸 그냥 사용해봤다.  <br>
<br>
원래 JWT의 의도대로라면, 서버는 사용자의 아이디와 비밀번호를 가지고 있으며 사용자가 인증요청을 해오면 이를 인증한뒤 JWT 토큰에 리소스의 접근권한 등을 담아서 보내줘야 하지만..  <br>
<br>
이 앱에는 회원가입 UI가 없으며 처음 사이트에 방문하면 닉네임을 물어보는게 전부다.  <br>
왜냐면 여기는 리소스의 접근권한이 어쩌고하는 개념이 필요한 큰 웹사이트도 아니고 애초에 jwt를 그냥 한번 사용해보는것에 의의를 두기때문에 생략한다.  <br>
<br>
즉 닉네임 그자체가 사용자의 게임 아이디이자 비밀번호가 된다. 이 말은 즉, 다른 사용자가 닉네임만 같게 바꾸면 사칭이 가능하겠지만 그런짓을 해도 얻는 보상이 없으므로 고려하지 않는다.  <br>
<br>
<br>

### 스택

###### Angular 6
메인 프레임워크
[Angular](https://angular.io/)

###### RxJS
데이터 흐름을 관리하는 라이브러리
[RxJS](https://rxjs-dev.firebaseapp.com/)

###### Prime Ng
UI 컴포넌트 라이브러리
[Prime Ng](https://www.primefaces.org/primeng/#/)

###### ngx-socket-io
소켓 라이브러리
[ngx-socket-io](https://www.npmjs.com/package/ngx-socket-io)

<br>

###### Express
서버 프레임워크
[Express](https://expressjs.com/ko/)

###### socket.io
소켓 라이브러리
[socket.io](https://socket.io/)

###### jsonwebtoken
JWT 라이브러리
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

<br>
<br>

### 마치며

프로젝트를 시작하기 전엔 angular는 러닝커브가 가파르기로 악명이 높다고 들어서 걱정을 많이했었다.  <br>
공식 문서를 봐도 다 영어로 되있어서 이걸 언제 다 보나.. 하고 매우 귀찮았지만 다행히도 매우 설명이 잘되있는 [강의 블로그](https://poiemaweb.com/angular-basics) 를 발견해서 무난하게 끝낼수 있었다  <br>
<br>
서비스와 Ioc가 어쩌고 rxjs와 옵저버블이 어쩌고하는 내용들은 배우기전에는 막막했지만 막상 익숙해지고 나니까 생각보다 할만했다.  위 블로그를 정독하고 공식문서를 다시 읽어보니 공식문서 또한 설명이 잘되있는 편이라 그것도 나쁘지 않았다.  <br> 
<br>
소켓통신을 코드를 작성하던도중, 점점 복잡해지는 모양새를 보니 Vue 의 메인 컨셉인 '선언형 프로그래밍'의 필요성이 왜 대두됬는지 어렴풋하게 느낄수 있었다.   <br>
혼자만 쓰는 개인 프로젝트일 경우엔 상관 없겠지만 여러사람이 쓰는 API 개발할 일이 생긴다면 선언형 프로그래밍에 대해 더 자세히 알아봐야 할것 같다. <br> 
<br>
다른 프레임워크에 비교해봤을때 앵귤러에서 맘에 들었던것은 라우팅 관련 지원을 해준다는 점이다.  <br>
ActiveRoute 라는 컴포넌트를 불러오면 여기에 현재url, path, path Params, query Params 등등 다 들어있어서 상당히 편리했다. <br>
<br>
리액트의 react-router는 제대로된 공식문서도 없고 사용법도 구글링하거나 직접 console.log 찍어가며 힘들게 익혀야 했는데 앵귤러는 이게 되서 편했다. Vue 도 공식문서에서 잠깐 본 바로는 앵귤러처럼 이렇게 구체적인 지원을 해주는거 같진 않았다.  <br>
<br>
단점은 역시나 급격한 러닝커브, 그리고 개인 또는 소규모의 간단한 프로젝트를 진행하기엔 프레임워크가 너무 방대하다는 것이다. 컴포넌트는 사용자에게 보여지는 뷰기능만 담당하고 구체적인 로직은 Service라는 컨셉으로 분리한다는 점은 상당히 매력적이지만 어쨌든 그 점 자체가 프레임워크를 복잡하게 만드는지라 장점이자 단점이 될수도 있다고 생각한다.  <br>
<br>
![춤추는파이리](https://lh3.googleusercontent.com/8KbpOKiDe_RDR_x746GwzTkg_aOXTImBf7nnyyD2wbMsdbiEyIO9mD98hV3Xy_VYFfuVkm7sLZ7TWZ0lWq2MFohAf_XRxaHmL_AzUMl8gG9lO3Me9i2AooBJKhvuMYxavuFVdYOfMmffPJp9_6umfuPN7Jq3Kd98bLlAHcaar0DQ0Ema9sg0YvcUb7LWpMCdeyP5dHUHTjVKupR3l_zX4vAD5QcWDASO9mSCQ8iz1iRNbhwImZjglTRWMnuBugdp5avwvpawbCbx6RBPGQ19lOSTXupKOxg31QQtqfqcQeGRbxNqwjUeTOU9kW22BDs9rl9arZymTmpTpotttvrFd0ANZbdCxWCeblsEjET9ya6xnlfZgFXxHrdVFeyo1w0yzzU6QQZpXvLvVCxBVy5XAFP04A-ZP1n_8Pi35tmG5I4VyTO7GH7LkY-hUFQraewlxhrJbKSzcCTp0QUuw2iR80yBO9xkpZwLqjCF-eXxSnj8_BmW-iOTzDPp51wX7DH9rIzYT1YhWdiHuNOae_wjsO0ULXRnOwrUeIP9Jm8iTsmZedBzm3LTGNV3JRlge5QSPSgvayoCqDxzyJ-spP2zETHlwwp72lghhq0FWpuimF1gCOVNml_3JR9nducTdqX_w-nlrSbWKxRcOrrs0VPn65zf=w300-h184-no)
