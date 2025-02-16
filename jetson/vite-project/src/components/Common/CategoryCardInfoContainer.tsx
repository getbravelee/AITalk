import './CategoryCardInfoContainer.css';
import { useEffect, useState } from 'react';

interface CategoryCardInfoProps {
  category: string; // 예: "fruit"
}

export default function CategoryCardInfoContainer({
  category,
}: CategoryCardInfoProps) {
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    // ✅ 카테고리 폴더 내 이미지 파일 불러오기
    const loadImages = async () => {
      try {
        // 🔥 폴더 내 모든 이미지 리스트 (배포 환경에서는 API 호출 필요)
        const images = ['apple.png', 'banana.png', 'grape.png']; // 실제로는 API 또는 서버에서 불러오기
        setImageList(
          images.map((img) => `/src/assets/card/${category}/${img}`),
        );
      } catch (error) {
        console.error('❌ Error loading images:', error);
      }
    };

    loadImages();
  }, [category]);

  return (
    <div className="CategoryCardInfoContainer">
      {imageList.length > 0 ? (
        imageList.map((src, index) => (
          <div key={index} className="CategoryCardItem">
            <img
              className="CategoryCardImage"
              src={src}
              alt={`${category} ${index}`}
            />
          </div>
        ))
      ) : (
        <p className="LoadingText">이미지를 불러오는 중...</p>
      )}
    </div>
  );
}
