import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import AiInfoContainer from '../components/Common/AiInfoContainer';

import './AiTalkPage.css';

export default function AiTalkPage() {
  const location = useLocation();
  const [aiText, setAiText] = useState(
    location.state?.aiText || '톡톡이가 대화할 준비 중이야...',
  );

  useEffect(() => {
    console.log('📡 Initial state received:', location.state);

    if (location.state?.aiText) {
      setAiText(location.state.aiText);
    }
  }, [location.state]); // ✅ `location.state` 변경될 때 업데이트

  useEffect(() => {
    // ✅ Socket.io 연결
    const socket = io('http://127.0.0.1:5000'); // Flask 서버 주소

    // ✅ GPT 응답 받기
    socket.on('gpt_response', (data) => {
      console.log('🤖 GPT 응답 도착:', data);

      if (data.response) {
        setAiText(data.response); // 📌 화면에 새로운 GPT 응답 반영
      }

      if (data.audio) {
        console.log('🎵 음성 재생 중...');
        const byteCharacters = atob(data.audio);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio
          .play()
          .then(() => {
            console.log('✅ TTS 재생 완료');
            socket.emit('tts_finished'); // ✅ TTS 재생이 끝나면 서버에 알림
          })
          .catch((err) => console.error('❌ Audio playback failed:', err));
      }
    });

    // ✅ TTS가 끝났다는 이벤트 수신
    socket.on('tts_finished', () => {
      console.log('🔥 TTS 재생이 끝났음! 다시 음성 인식 시작해야 함!');
    });

    return () => {
      socket.disconnect(); // ✅ 컴포넌트 언마운트 시 소켓 연결 해제
    };
  }, []); // 🔄 GPT 응답을 받을 때만 실행됨

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="AiTalkContainer">
        <AiInfoContainer aiText={aiText} />
      </div>
    </div>
  );
}
