import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { fetchBackendMealImage, getFallbackImageByTitle } from '../../services/dietImageService';

interface Props {
  mealTitle: string;
  mealType?: string;
  description?: string;
  style?: any;
}

export default function ValidatedMealImage({ mealTitle, mealType = 'lunch', description = '', style = {} }: Props) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchBackendMealImage({ mealTitle, mealType, description })
      .then(record => {
        if (isMounted && record) {
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
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color="#2563EB" />
        </View>
      )}
      {imgSrc && !loading && (
        <Animated.Image 
          entering={FadeIn.duration(300)}
          source={{ uri: imgSrc }} 
          style={styles.image} 
          onError={handleError}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});
