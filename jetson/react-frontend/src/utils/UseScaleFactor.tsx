import { useState, useEffect } from 'react';

export const UseScaleFactor = (customMultiplier: number = 1.4): number => {
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const updateScaleFactor = () => {
      const baseScale = 1 / window.devicePixelRatio;
      setScaleFactor(baseScale * customMultiplier);
    };

    updateScaleFactor();
    window.addEventListener('resize', updateScaleFactor);

    return () => window.removeEventListener('resize', updateScaleFactor);
  }, [customMultiplier]);

  return scaleFactor;
};
