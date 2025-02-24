# 아이톡(AITALK) 
생성형 AI기술 기반의 언어치료교구

<img src="./assets/main.png"/>


## :speaking_head: 프로젝트 소개 

> ⌛ 프로젝트 기간 : 2025년 1월 13일 ~ 2월 21일

### 개요

#### SSAFY 12기 2학기 공통 프로젝트

생성형 AI 기술과 IoT가 접목된 본 언어치료용 AI 교구 디바이스는 기존의 그림카드나 인쇄물 교구와는 차별화된 혁신적인 솔루션입니다. 이 디바이스는 아이톡의 효과음, 다채로운 애니메이션, 그리고 귀여운 외관을 통해 치료 아동의 흥미를 자연스럽게 유도하며, 치료 환경을 보다 즐겁고 몰입감 있게 만들어줍니다.

또한, AI톡톡이와의 실시간 대화 기능은 폐쇄형 질문과 아동 개인 데이터를 기반으로 맞춤형 대화를 구성하여, 아동이 자신의 언어 능력에 자신감을 가질 수 있도록 돕습니다. 실시간 대화 시스템은 아동의 반응과 학습 패턴을 분석해 개별 맞춤형 피드백을 제공함으로써, 효과적인 언어 치료를 지원합니다.

더불어, NFC 카드 태깅을 활용한 단어치료는 아동이 직접 치료 과정에 참여할 수 있도록 설계되어, 학습에 대한 흥미와 자발적인 참여를 높입니다. 사물 인식을 통해 생성된 이미지로 상황을 설명하는 치료 방법은 기존의 교구나 물건들을 재활용할 수 있을 뿐만 아니라, 다양한 상황 이미지를 제공하여 언어치료사가 자료를 준비하는 번거로움을 크게 해소해 줍니다.

이처럼, 본 디바이스는 최신 AI 기술과 IoT를 결합하여 언어치료 현장에서의 다양한 문제점을 혁신적으로 해결하고, 아동의 언어 학습 및 치료 효과를 극대화하는 데 기여할 것입니다.


## 👥 팀 구성
<table style="text-align: center;" width="100%">

  <tr>
    <td style="text-align: center;" width="16.66%">천세윤<br/><a href=""></a></td>
    <td style="text-align: center;" width="16.66%">박수민<br/><a href=""></a></td>
    <td style="text-align: center;" width="16.66%">이수환<br/><a href=""></a></td>
    <td style="text-align: center;" width="16.66%">김우영<br/><a href=""></a></td>
    <td style="text-align: center;" width="16.66%">최진문<br/><a href=""></a></td>
    <td style="text-align: center;" width="16.66%">김경민<br/><a href=""></a></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="16.66%">백엔드, 프론트 </br> (팀장) 
    </br> 로그인, 치료 아동 관리, 카드 태깅 관련 api / 언어치료사 웹 화면</td>
    <td style="text-align: center;" width="16.66%">백엔드 </br> 백엔드 스케줄 관리, 로컬 id,pw 로그인, 대화하기 및 3어문, 로컬 아동 목록 api</td>
    <td style="text-align: center;" width="16.66%">인프라</td>
    <td style="text-align: center;" width="16.66%">백엔드 개발</td>
    <td style="text-align: center;" width="16.66%">프론트 개발</td>
    <td style="text-align: center;" width="16.66%">백엔드</br>
    회원가입, 회원 관리 api/얼굴 인식, 사물인식 관련 api </td>
  </tr>
</table>


## 📌 주요 기능

### 디바이스
<details>
<summary><strong>로그인, 얼굴등록, 아동 선택 </strong></summary>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">페이스 아이디 로그인</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="페이스 아이디 로그인" src="./assets/faceId.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">간편 얼굴 인식 로그인을 통한 빠른 로그인이 가능합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">아이디 비밀번호 로그인</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="아이디 로그인" src="./assets/idLogin.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">얼굴인식 실패 시 아이디와 비밀번호로 로그인이 가능합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">카드 로그인</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="카드 로그인" src="./assets/cardLogin.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">NFC 카드를 이용하여 카드태깅으로 로그인이 가능합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">얼굴 등록</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="얼굴 등록" src="./assets/faceRegister.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">얼굴 인식을 통해 얼굴을 등록할 수 있습니다.</td>
  </tr>
</table>
<hr/>


<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">아동 선택 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="아동 선택" src="./assets/choiceChild.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">아동 얼굴 인식 혹은 리스트에서 치료 아동을 선택할 수 있습니다.</td>
  </tr>
</table>
<hr/>

</details>


<details>
<summary><strong>카드 태깅</strong></summary>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">1. 카드 태깅 페이지</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="페이스 아이디 로그인" src="./assets/cardTag.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">카드 태깅을 위한 로딩 페이지 입니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">2. 카드 태깅 후 이미지</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="아이디 로그인" src="./assets/cardWord.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">명사 카드 태깅 후 카드의 칩에 담긴 데이터를 가져와 디바이스에 이미지를 띄웁니다. 단어 버튼 선택 시 단어 치료로 이동하고, 상황극 선택 시 상황 이미지를 ai로 생성해서 띄웁니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">3. 동사 카드 추가 태깅</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="동사 카드 태깅" src="./assets/cardTwo.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">명사 카드 태깅 후 동사 카드 태깅 시 동사 이미지가 디바이스에 뜹니다.</td>
  </tr> 
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">3-1. 명사 + 동사 이미지 생성 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="2어문 생성" src="./assets/cardPlus.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">명사와 동사를 합한 2어문으로 이미지를 생성하여 화면에 띄웁니다.</td>
  </tr>
</table>
<hr/>


<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">4. 상황극 버튼 선택 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="상황극 선택" src="./assets/cardSentence.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">태깅된 명사 카드의 이미지에서 상황극 버튼 클릭 시 이미지를 생성합니다. 이미지 생성을 위해 AI 프롬포트 작성을 하여 생성합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">4. 상황극 버튼 선택 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="상황극 선택" src="./assets/cardSentence.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">태깅된 명사 카드의 이미지에서 상황극 버튼 클릭 시 이미지를 생성합니다. 이미지 생성을 위해 AI 프롬포트 작성을 하여 생성합니다.</td>
  </tr>
</table>
<hr/>
<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">4-1. 상황극 이미지 생성 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="상황극 이미지" src="./assets/makeSentence.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">AI에 의해 생성된 이미지와 상황에 대한 텍스트를 기반으로 상황 설명 치료를 시작합니다.</td>
  </tr>
</table>
<hr/>

</details>

<details>
<summary><strong>사물 인식 이미지 생성</strong></summary>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">1. 사물 인식 페이지</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="사물 인식" src="./assets/visionStart.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">주변 사물 또는 기존의 교구를 카메라에 비춰 사물인식을 시작합니다. 현재 컵을 비춘 모습입니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">2. AI 이미지 생성</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="이미지 생성" src="./assets/visionPhoto.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">인식한 사물 텍스트를 이용하여 사물 이미지를 생성합니다. 그 후 상황극 버튼 클릭 시 해당 이미지로 상황 이미지를 생성합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">3. 상황 이미지 생성</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="상황 이미지" src="./assets/vision3sentence.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">사물 텍스트를 이용하여 gpt로 상황 텍스트를 생성 후 이미지 생성 ai를 이용한 생성형 이미지를 띄워줍니다. 언어치료사와 아동이 해당 이미지로 상황 설명 치료를 할 수 있습니다.</td>
  </tr> 
</table>
<hr/>

</details>

<details>
<summary><strong>톡톡이와 대화하기</strong></summary>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">1. 대화하기 선택 페이지</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="대화하기 선택" src="./assets/selectToktok.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">치료 선택 페이지에서 톡톡이와의 대화 버튼을 선택합니다. 아동의 데이터를 기반으로 치료아동을 위한 대화가 시작됩니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">2. AI와 실시간 대화하기</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="대화 시작" src="./assets/toktok.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">아동의 수준에 맞춘 대화를 시작합니다. 아동은 단순한 질문들을 통해 대화에 자신감을 가지게 됩니다.</td>
  </tr>
</table>
<hr/>

</details>

### 웹페이지

<details>
<summary><strong>로그인, 회원가입, 아이디 찾기, 비밀번호 변경 </strong></summary>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">1. 로그인 페이지</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="로그인 하기" src="./assets/login.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">아이디와 비밀번호를 통하여 언어치료사가 로그인합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">2. 회원가입 페이지</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="회원가입" src="./assets/signup.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">회원가입을 진행합니다. 이메일 인증을 진행합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">2-1. 회원가입 이메일 인증</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="회원가입 이메일" src="./assets/signupEmail.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">이메일 요청 시 인증 코드가 해당 이메일로 전송됩니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">3. 아이디 찾기 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="아이디 찾기" src="./assets/idFind.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">아이디 찾기를 진행합니다. 이름과 이메일로 인증 시 해당 이메일로 아이디가 전송됩니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">4. 비밀번호 변경 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="비밀번호 변경" src="./assets/pwFind.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">비밀번호 변경을 진행합니다. 이름과 아이디 이메일로 인증 시 해당 이메일로 인증 코드가 발송되고, 인증코드를 기입하면 비밀번호 변경창으로 이동합니다.</td>
  </tr>
</table>
<hr/>

</details>

<details>
<summary><strong>스케줄 관리 페이지</strong></summary>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">1. 한달 스케줄 확인</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="한달스케줄" src="./assets/schedule.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">한달의 전반적인 스케줄을 확인이 가능합니다. </td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">2. 일정 확인</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="일정 확인" src="./assets/daySchedule.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">하루 일정을 확인할 수 있습니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">3. 스케줄 상세 내용 확인</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="스케줄 디테일" src="./assets/detailSchedule.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">하나의 스케줄 클릭 시 치료 내용과 치료 아동의 정보를 상세히 볼 수 있습니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">4. 스케줄 수정 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="스케줄 수정" src="./assets/modifySchedule.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">스케줄 수정 시 대화요약 내용에서 치료 시 특이 사항 등을 작성하여 수정이 가능합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">5. 스케줄 등록 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="스케줄 등록" src="./assets/registerSchedule.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">새로운 스케줄을 등록합니다. 아동을 선택하면 해당 아동이 있는 센터가 자동으로 지정됩니다. 치료 시간 등을 기입할 수 있습니다.</td>
  </tr>
</table>
<hr/>

</details>

<details>
<summary><strong>치료 아동 관리 </strong></summary>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">1. 치료 아동 리스트</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="치료 아동 리스트" src="./assets/childrenList.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">언어치료사가 담당하는 아동 전체를 볼 수 있습니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">2. 아동 검색</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="아동 검색" src="./assets/childSearch.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">아동의 이름으로 검색이 가능합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">3. 아동 상세 페이지</th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="아동 디테일" src="./assets/childDetail.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">치료 아동 상세 정보를 확인할 수 있습니다. 아동의 치료내용도 확인 가능합니다.</td>
  </tr>
</table>
<hr/>

<table style="text-align: center;" width="100%">
  <tr>
    <th style="text-align: center;" width="25%">4. 아동 등록 </th>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%"><img height="400" alt="아동 등록" src="./assets/childRegister.png" ></td>
  </tr>
  <tr>
    <td style="text-align: center;" width="25%">치료 아동을 등록합니다. 아동 등록 시 이름, 연령, 목표 치료 영역, 센터, 보호자 번호를 기입합니다.</td>
  </tr>
</table>
<hr/>


</details>

## 프로젝트 구조

