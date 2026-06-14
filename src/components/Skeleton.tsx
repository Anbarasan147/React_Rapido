import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const styles: React.CSSProperties = {
    width: width,
    height: height,
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded h-3 w-3/4';
      case 'rectangular':
      default:
        return 'rounded-2xl';
    }
  };

  return (
    <div
      style={styles}
      className={`animate-pulse bg-[#24242B] ${getVariantClass()} ${className}`}
    />
  );
};
export default Skeleton;
