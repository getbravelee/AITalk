import { createContext, useContext, useEffect, useState } from 'react';

const AudioContext = createContext({
  isPlaying: false,
  toggleAudio: () => {},
  setAudioType: (type: 'home' | 'page') => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioType, setAudioType] = useState<'home' | 'page'>('page');
  const [audio, setAudio] = useState(
    new Audio('/src/assets/audio/pagemusic.mp3'),
  );

  useEffect(() => {
    if (isPlaying) {
      audio.loop = true;
      audio.volume = 0.5;
      if (audio.paused) {
        audio.play().catch((err) => console.error('Audio play error:', err));
      }
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isPlaying, audio]);

  // 🔥 **음악 변경 로직 수정 (기존 음악을 멈춘 후 새 음악 설정)**
  useEffect(() => {
    audio.pause(); // ✅ 기존 음악 정지
    audio.currentTime = 0; // ✅ 처음부터 시작

    if (audioType === 'home') {
      const newAudio = new Audio('/src/assets/audio/homepagemusic.mp3');
      setAudio(newAudio);
    } else if (audioType === 'page') {
      const newAudio = new Audio('/src/assets/audio/pagemusic.mp3');
      setAudio(newAudio);
    }

    if (isPlaying) {
      audio.play().catch((err) => console.error('Audio play error:', err));
    }
  }, [audioType]);

  const toggleAudio = () => setIsPlaying((prev) => !prev);

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, setAudioType }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
