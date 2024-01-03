// Image wrapper for base64 image
import React from 'react';
import { LazyLoadImage} from 'react-lazy-load-image-component'

import styles from './ImageContainer.module.scss'

type ImageContainerProps = {
  imageData: string; 
};

const ImageContainer: React.FC<ImageContainerProps> = ({ imageData }) => {
  const imageUrl = `data:image/*;base64,${imageData}`;

  return (
    <div className={styles['image-container']}>
      <LazyLoadImage src={imageUrl} alt="Post Image" loading='lazy'/>
    </div>
  );
};

export default ImageContainer;
