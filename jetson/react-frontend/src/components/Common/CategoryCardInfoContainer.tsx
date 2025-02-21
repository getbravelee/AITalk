import './CategoryCardInfoContainer.css';
import { useEffect, useState } from 'react';

interface CategoryCardInfoProps {
  category: string; // ✅ 예: "fruit"
  categories: string[]; // ✅ 여러 개의 카테고리 리스트 예: ['apple', 'banana', 'grape']
}

export default function CategoryCardInfoContainer({
  category,
  categories,
}: CategoryCardInfoProps) {
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    if (categories.length > 0) {
      // ✅ categories 배열을 기반으로 이미지 경로 생성
      const images = categories.map(
        (item) => `/images/card/${category}/${item}.png`,
      );
      setImageList(images);
    }
  }, [category, categories]);

  return (
    <div className="CategoryCardInfoContainer">
      {imageList.length > 0 ? (
        imageList.map((src, index) => (
          <div key={index} className="CategoryCardItem">
            <img
              className="CategoryCardImage"
              src={src}
              alt={categories[index]}
            />
          </div>
        ))
      ) : (
        <p className="LoadingText">이미지를 불러오는 중...</p>
      )}
    </div>
  );
}
