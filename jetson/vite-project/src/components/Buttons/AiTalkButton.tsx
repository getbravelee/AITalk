import { useNavigate } from 'react-router-dom';
import { useAudio } from '../Common/AudioContext';
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:5000');

export default function AiTalkButton({ childId }: { childId: string }) {
  const navigate = useNavigate();
  const { isPlaying, toggleAudio } = useAudio();

  console.log(`✅ [AiTalkButton] 받은 childId: ${childId}`);

  const handleClick = (): void => {
    if (!childId) {
      console.error('❌ [AiTalkButton] childId is missing.');
      return;
    }

    console.log('📡 Navigating to /ai-talk page first...');

    if (isPlaying) {
      console.log('🔇 배경음악 끄기...');
      toggleAudio();
    }

    navigate('/ai-talk', {
      state: {
        aiText: '톡톡이가 너와 대화할 준비 중이야...',
        childId: childId, // ✅ `props`로 받은 `childId` 전달
      },
    });

    setTimeout(async () => {
      console.log('📡 Sending request to AI Talk API after delay...');
      try {
        const response = await fetch('http://127.0.0.1:5000/play/talk-start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childId }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to start AI Talk (Status: ${response.status})`,
          );
        }

        const data = await response.json();
        console.log('🔍 Full API Response:', data);

        if (!data.audio || !data.message) {
          throw new Error('No audio or message received from the API.');
        }

        let audio: HTMLAudioElement;
        if (data.audio.startsWith('http')) {
          console.log('🎵 Playing from URL:', data.audio);
          audio = new Audio(data.audio);
        } else {
          console.log('🎵 Decoding Base64 audio...');
          const byteCharacters = atob(data.audio);
          const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });

          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('🎵 Audio URL:', audioUrl);

          audio = new Audio(audioUrl);
        }

        audio.addEventListener('ended', () => {
          console.log('✅ TTS 재생 완료 - 서버로 WebSocket 이벤트 전송');
          socket.emit('tts_finished');
        });

        audio
          .play()
          .catch((err) => console.error('❌ Audio playback failed:', err));

        navigate('/ai-talk', {
          state: { aiText: data.message, childId: childId }, // ✅ childId 유지
          replace: true,
        });
      } catch (error) {
        console.error('❌ Error fetching AI Talk response:', error);
      }
    }, 1000);
  };

  return (
    <button onClick={handleClick}>
      <img src="/src/assets/menu/symbol.png" alt="톡톡이 아이콘" />
      <span>톡톡이와 이야기 하기</span>
    </button>
  );
}
