import '@lottiefiles/lottie-player'; // 웹 컴포넌트 등록

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src: string;
        background: string;
        speed: string;
        loop: boolean;
        autoplay: boolean;
      };
    }
  }
}

const FaceIdAnimationLoading = () => {
  return (
    <div style={{ width: '250px', height: '250px', marginTop: '-100px' }}>
      <lottie-player
        src="/assets/Login/faceid_animation_1.json"
        background="transparent"
        speed="1"
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      >
      </lottie-player>
    </div>
  );
};

const FaceIdAnimationCheck = () => {
  return (
    <div style={{ width: '250px', height: '250px', marginTop: '-100px' }}>
      <lottie-player
        src="/assets/Login/faceid_animation_2.json"
        background="transparent"
        speed="1"
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      ></lottie-player>
    </div>
  );
};

const FaceIdAnimationLoadingForKid = () => {
  return (
    <div style={{ width: '50px', height: '50px', marginLeft: '20px'}}>
      <lottie-player
        src="/assets/Login/faceid_animation_1.json"
        background="transparent"
        speed="1"
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      ></lottie-player>
    </div>
  );
};

const FaceIdAnimationCheckForKid = () => {
  return (
    <div style={{ width: '50px', height: '50px', marginLeft: '20px'}}>
      <lottie-player
        src="/assets/Login/faceid_animation_2.json"
        background="transparent"
        speed="1"
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      ></lottie-player>
    </div>
  );
};

export {
  FaceIdAnimationLoading,
  FaceIdAnimationCheck,
  FaceIdAnimationLoadingForKid,
  FaceIdAnimationCheckForKid,
};
