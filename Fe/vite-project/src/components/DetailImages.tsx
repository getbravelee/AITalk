import '../styles/DetailImages.css'

interface ImagesProps {
  width: number;
  height: number;
}
export default function Images ({width, height}: ImagesProps) {
  const imgSrc = `https://picsum.photos/${width}/${height}`;
  return (
    <div className="images">
      <img src={imgSrc} alt="random" />
      <img src={imgSrc} alt="random" />
      <img src={imgSrc} alt="random" />
      <img src={imgSrc} alt="random" />
      <img src={imgSrc} alt="random" />
      <img src={imgSrc} alt="random" />
    </div>
  )
}