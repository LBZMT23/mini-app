import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const Toast = () => {
  const { toastMsg } = useAppContext();
  
  return (
    <AnimatePresence>
      {toastMsg && (
        <motion.div 
          initial={{ opacity: 0, y: '-50%', x: '-50%', scale: 0.9 }}
          animate={{ opacity: 1, y: '-50%', x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: '-50%', x: '-50%', scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/2 left-1/2 bg-black/80 text-white px-6 py-3 rounded-xl text-sm z-[10000] pointer-events-none"
        >
          {toastMsg}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
