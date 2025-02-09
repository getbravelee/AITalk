import { useNavigate } from 'react-router-dom';
import { useAudio } from '../Common/AudioContext'; // 🎵 오디오 컨텍스트 추가

export default function AiTalkButton() {
  const navigate = useNavigate();
  const { isPlaying, toggleAudio } = useAudio(); // 🎵 현재 음악 상태 및 토글 함수 가져오기

  const handleClick = (): void => {
    console.log('📡 Navigating to /ai-talk page first...');

    // 🎵 배경음악이 켜져 있다면 끄기
    if (isPlaying) {
      console.log('🔇 배경음악 끄기...');
      toggleAudio();
    }

    // 🏃‍♂️ `/ai-talk`로 이동 (초기 state는 임시 값)
    navigate('/ai-talk', {
      state: { aiText: '톡톡이가 너와 대화할 준비 중이야...' },
    });

    // 1초 후 API 요청 & state 업데이트
    setTimeout(async () => {
      console.log('📡 Sending request to AI Talk API after delay...');
      try {
        const response = await fetch('http://127.0.0.1:5000/play/talk-start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childId: 10001 }),
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

        // 🎵 음성 재생 로직
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

        audio
          .play()
          .catch((err) => console.error('❌ Audio playback failed:', err));

        // 📢 `/ai-talk` 페이지의 state를 업데이트 (replace 사용)
        navigate('/ai-talk', {
          state: { aiText: data.message },
          replace: true,
        });
      } catch (error) {
        console.error('❌ Error fetching AI Talk response:', error);
      }
    }, 1000); // 1초 후 실행
  };

  return (
    <button onClick={handleClick}>
      <img src="/src/assets/menu/symbol.png" alt="톡톡이 아이콘" />
      <span>톡톡이와 이야기 하기</span>
    </button>
  );
}
