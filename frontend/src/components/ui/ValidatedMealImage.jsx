import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchBackendMealImage, getFallbackImageByTitle } from '../../services/dietImageService';

export default function ValidatedMealImage({ mealTitle, mealType = 'lunch', description = '', style = {}, alt = '' }) {
  const [imageRecord, setImageRecord] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchBackendMealImage({ mealTitle, mealType, description })
      .then(record => {
        if (isMounted && record) {
          setImageRecord(record);
          setImgSrc(record.imageUrl);
        }
      })
      .catch(err => {
        console.warn('Error rendering validated meal image:', err);
        if (isMounted) {
          setImgSrc(getFallbackImageByTitle(mealTitle, mealType));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [mealTitle, mealType, description]);

  const handleError = () => {
    setImgSrc(getFallbackImageByTitle(mealTitle, mealType));
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#F1F5F9', borderRadius: 'inherit', ...style }}>
      {loading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
          backgroundSize: '200% 100%',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      )}
      {imgSrc && (
        <motion.img 
          src={imgSrc} 
          alt={alt || mealTitle}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.06 }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      )}
    </div>
  );
}
