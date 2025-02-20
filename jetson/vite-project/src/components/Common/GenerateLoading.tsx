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

const GenerateLoading = () => {
  return (
    <div style={{ width: '250px', height: '250px' }}>
      <lottie-player
        src="/assets/GenerateLoading/generate_animation.json"
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
  GenerateLoading,
};
