import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageWrapperProps {
  children: ReactNode;
  type?: 'slide' | 'fade';
  className?: string;
}

export const PageWrapper = ({ children, type = 'slide', className }: PageWrapperProps) => {
  const variants = type === 'slide' ? {
    initial: { x: '100%', zIndex: 20 },
    animate: { x: 0, zIndex: 20, transition: { type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 } },
    exit: { x: '100%', zIndex: 20, transition: { type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 } }
  } : {
    initial: { opacity: 0, zIndex: 10 },
    animate: { opacity: 1, zIndex: 10, transition: { duration: 0.3 } },
    exit: { opacity: 0, zIndex: 10, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`absolute inset-0 flex flex-col bg-[#f0f2f5] ${className || ''}`}
    >
      {children}
    </motion.div>
  );
};
