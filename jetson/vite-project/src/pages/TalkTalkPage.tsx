import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './TalkTalkPage.css';

export default function TalkTalkPage() {
  const location = useLocation();
  const [backgroundImage, setBackgroundImage] = useState(
    '/src/assets/mascot/Smile.png',
  );
  let talkInterval: NodeJS.Timeout | null = null;

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Flask 서버 주소

    socket.on('speech_ready', () => {
      console.log('🎙 음성 인식이 시작됨! (아직 말하지 않음)');
      setBackgroundImage('/src/assets/mascot/Smile.png');
    });

    socket.on('speech_detected', () => {
      console.log('🎙 음성 감지 시작! 사용자가 말하고 있음...');
      setBackgroundImage('/src/assets/mascot/Listen.png');
    });

    socket.on('speech_stopped', () => {
      console.log('🔁 [프론트] speech_stopped 이벤트 수신됨 → 상태 변경 실행');
      setTimeout(() => {
        setBackgroundImage('/src/assets/mascot/Smile.png');
      }, 0);
    });

    socket.on('gpt_response', (data) => {
      console.log('🤖 GPT 응답 도착:', data);

      if (data.response || data.audio) {
        console.log('🎵 음성 재생 중...');

        talkInterval = setInterval(() => {
          setBackgroundImage((prev) =>
            prev === '/src/assets/mascot/Talk.png'
              ? '/src/assets/mascot/Listen.png'
              : '/src/assets/mascot/Talk.png',
          );
        }, 500);
      }

      if (data.audio) {
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

    socket.on('tts_finished', () => {
      console.log('✅ 말하기 종료 → 기본 상태로 복귀');
      setBackgroundImage('/src/assets/mascot/Smile.png');

      if (talkInterval) {
        clearInterval(talkInterval);
        talkInterval = null;
      }
    });

    return () => {
      socket.disconnect();
      if (talkInterval) {
        clearInterval(talkInterval);
      }
    };
  }, []);

  return (
    <div
      className="TalkContainer"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* 배경만 바뀌고 텍스트 없음 */}
    </div>
  );
}
