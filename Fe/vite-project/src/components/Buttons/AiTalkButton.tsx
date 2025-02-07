import { useNavigate } from 'react-router-dom';

export default function AiTalkButton() {
  const navigate = useNavigate();

  const handleClick = async (): Promise<void> => {
    console.log('📡 Sending request to AI Talk API...');

    try {
      const response = await fetch(
        'http://192.168.30.146:5000/play/talk-start',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childId: 10001 }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to start AI Talk (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log('🔍 Full API Response:', data);

      if (!data.audio || !data.message) {
        throw new Error('No audio or message received from the API.');
      }

      // 🎵 음성 재생 로직
      if (data.audio.startsWith('http')) {
        console.log('🎵 Playing from URL:', data.audio);
        const audio = new Audio(data.audio);
        audio
          .play()
          .catch((err) => console.error('❌ Audio playback failed:', err));
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

        const audio = new Audio(audioUrl);
        audio
          .play()
          .catch((err) => console.error('❌ Audio playback failed:', err));
      }

      // 🏃‍♂️ `/ai-talk` 페이지로 이동하면서 `data.message` 전달
      navigate('/ai-talk', { state: { aiText: data.message } });
    } catch (error) {
      console.error('❌ Error fetching AI Talk response:', error);
    }
  };

  return (
    <button onClick={handleClick}>
      <img src="/src/assets/menu/symbol.png" alt="톡톡이 아이콘" />
      <span>톡톡이와 이야기 하기</span>
    </button>
  );
}
