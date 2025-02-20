import { useNavigate } from 'react-router-dom';
import { useAudio } from '../Common/AudioContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

interface AiTalkButtonProps {
  childId: string | undefined;
  className?: string;
}

export default function AiTalkButton({
  childId,
  className,
}: AiTalkButtonProps) {
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

    // talk-talk로 하면 캐릭터가 말하는 화면으로
    navigate('/ai-talk', {
      state: {
        aiText: '톡톡이가 너와 대화할 준비 중이야...',
        childId: childId, // ✅ `props`로 받은 `childId` 전달
      },
    });

    setTimeout(async () => {
      console.log('📡 Sending request to AI Talk API after delay...');
      try {
        const response = await fetch('http://localhost:5000/play/talk-start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ child_id: childId }),
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

        // talk-talk로 하면 캐릭터가 말하는 화면으로
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
    <button className={`AiTalkButton ${className || ''}`} onClick={handleClick}>
      <img src="/images/menu/symbol.png" alt="톡톡이 아이콘" />
      <span>톡톡이</span>
    </button>
  );
}
