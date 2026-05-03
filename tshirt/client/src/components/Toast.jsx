import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="toast show"
          initial={{ y: 20, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: 20, x: '-50%', opacity: 0 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
