import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import AiInfoContainer from '../components/Common/AiInfoContainer';

import './AiTalkPage.css';

export default function AiTalkPage() {
  const location = useLocation();

  // ✅ `childId` 확인
  const childId = location.state?.childId;
  console.log('📌 [AiTalkPage] 받은 childId:', childId);

  const [aiText, setAiText] = useState(
    location.state?.aiText || '톡톡이가 대화할 준비 중이야...',
  );

  const [speechStatus, setSpeechStatus] = useState('🟡 톡톡이 깨우는 중 ...');

  useEffect(() => {
    console.log('📡 Initial state received:', location.state);

    if (location.state?.aiText) {
      setAiText(location.state.aiText);
    }
  }, [location.state]);

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Flask 서버 주소
    // ✅ "음성 인식이 시작됨" 상태 감지 (사용자가 말할 준비 상태)
    socket.on('speech_ready', () => {
      console.log('🎙 음성 인식이 시작됨! (아직 말하지 않음)');
      setSpeechStatus('🟢 지금 말할 수 있어요 !');
    });

    socket.on('speech_detected', () => {
      console.log('🎙 음성 감지 시작! 사용자가 말하고 있음...');
      setSpeechStatus('🎤 음성 감지 중 ...');
    });

    socket.on('speech_stopped', () => {
      console.log('🔁 [프론트] speech_stopped 이벤트 수신됨 → 상태 변경 실행');
      setTimeout(() => {
        setSpeechStatus('🟡 톡톡이가 생각 중 ... ');
        console.log('🟡 [프론트] 상태 업데이트 완료: 톡톡이가 생각 중...');
      }, 0);
    });

    socket.on('gpt_response', (data) => {
      console.log('🤖 GPT 응답 도착:', data);

      if (data.response) {
        setAiText(data.response);
      }

      if (data.audio) {
        console.log('🎵 음성 재생 중...');
        setSpeechStatus('🔴 톡톡이가 말하는 중... ');

        const byteCharacters = atob(data.audio);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.addEventListener('ended', () => {
          console.log('✅ TTS 재생 완료');
          socket.emit('tts_finished');
        });

        audio
          .play()
          .catch((err) => console.error('❌ Audio playback failed:', err));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="AiTalkContainer">
        <AiInfoContainer
          aiText={aiText}
          isTalking={speechStatus.includes('🔴')}
        />
        <p
          className={`speech-status ${
            speechStatus.includes('🟢')
              ? 'speak-ready'
              : speechStatus.includes('🎤')
                ? 'speaking'
                : speechStatus.includes('🟡')
                  ? 'thinking'
                  : speechStatus.includes('🔴')
                    ? 'talking'
                    : ''
          }`}
        >
          {speechStatus}
        </p>
      </div>
    </div>
  );
}
