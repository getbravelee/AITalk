import { useAudio } from './AudioContext';
import './NavbarContainer.css';

interface NavbarContainerProps {
  children?: React.ReactNode;
}

export default function NavbarContainer({ children }: NavbarContainerProps) {
  const { isPlaying, toggleAudio } = useAudio(); // 🎵 오디오 상태 & 토글 함수 가져오기

  return (
    <div className="NavbarContainer">
      <button className="MusicToggleButton" onClick={toggleAudio}>
        <img
          src={
            isPlaying
              ? '/images/common/sound_off.png'
              : '/images/common/sound_on.png'
          }
          alt={isPlaying ? '음악 끄기' : '음악 켜기'}
          className="MusicToggleIcon"
        />
      </button>
      {children} {/* children을 추가하여 원하는 요소를 삽입 가능하게 만듦 */}
    </div>
  );
}
