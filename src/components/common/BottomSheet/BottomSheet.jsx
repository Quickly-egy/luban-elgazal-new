import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import './BottomSheet.css';

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  showSearch = false,
  searchPlaceholder = "بحث...",
  applyButtonText = "تطبيق"
}) => {
  // Portal container
  const portalContainer = document.body;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.1 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1 }
    }
  };

  const sheetVariants = {
    hidden: { 
      y: '100%',
      opacity: 0
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 35,
        stiffness: 700,
        mass: 0.8
      }
    },
    exit: { 
      y: '100%',
      opacity: 0,
      transition: { 
        duration: 0.1,
        ease: "easeIn"
      }
    }
  };

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

      return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="bottom-sheet-container">
          {/* Overlay */}
          <motion.div
            className="bottom-sheet-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            layout={false}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            className="bottom-sheet"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            layout={false}
            layoutId={false}
          >
            {/* Drag Handle */}
            <div className="bottom-sheet-handle">
              <div className="bottom-sheet-handle-bar" />
            </div>
            
            {/* Header */}
            <div className="bottom-sheet-header">
              <button 
                className="bottom-sheet-close"
                onClick={onClose}
                aria-label="إغلاق"
              >
                ×
              </button>
              <h3 className="bottom-sheet-title">{title}</h3>
            </div>
            
            {/* Search Box */}
            {showSearch && (
              <div className="bottom-sheet-search">
                <div className="bottom-sheet-search-wrapper">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="bottom-sheet-search-input"
                  />
                  <div className="bottom-sheet-search-icon">
                    🔍
                  </div>
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className="bottom-sheet-content">
              {children}
            </div>
            
            {/* Apply Button */}
            <div className="bottom-sheet-footer">
              <button
                className="bottom-sheet-apply-btn"
                onClick={onClose}
              >
                {applyButtonText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalContainer
  );
};

export default BottomSheet; 