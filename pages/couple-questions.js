import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@heroui/react';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';
import { coupleQuestions } from '../data/coupleQuestions';
import { useRouter } from 'next/router';

// Shuffle function
const shuffle = (array) => {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

const CardStack = ({ question, index, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) {
      onSwipe('left');
    } else if (info.offset.x > 100) {
      onSwipe('right');
    }
  };

  const variants = {
    front: {
      zIndex: 10,
      scale: 1,
      opacity: 1,
      y: 0,
      rotateZ: 0,
      filter: 'blur(0px)',
      boxShadow: '0 0 25px rgba(212, 160, 82, 0.3), 0 0 50px rgba(212, 160, 82, 0.1), 0 25px 50px rgba(0,0,0,0.5)',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      }
    },
    middle: {
      zIndex: 5,
      scale: 0.92,
      opacity: 0.6,
      y: 25,
      rotateZ: -2,
      filter: 'blur(1px)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      transition: { duration: 0.4 }
    },
    back: {
      zIndex: 1,
      scale: 0.85,
      opacity: 0.3,
      y: 50,
      rotateZ: 2,
      filter: 'blur(2px)',
      boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
      transition: { duration: 0.4 }
    },
    hidden: {
        zIndex: 0,
        scale: 0.8,
        opacity: 0,
        y: 80,
        filter: 'blur(4px)',
    },
    exit: (direction) => ({
      zIndex: 15,
      x: direction === 'left' ? -1000 : 1000,
      opacity: 0,
      rotateZ: direction === 'left' ? -20 : 20,
      transition: { duration: 0.4, ease: "easeInOut" },
    })
  };

  // Determine variant based on position
  let animateVariant = 'hidden';
  if (index === 0) animateVariant = 'front';
  else if (index === 1) animateVariant = 'middle';
  else if (index === 2) animateVariant = 'back';

  return (
    <motion.div
      style={{
        // width and height removed, handled by className
        position: 'absolute',
        x: index === 0 ? x : 0,
        rotate: index === 0 ? rotate : 0,
        opacity: index === 0 ? opacity : undefined,
        cursor: index === 0 ? 'grab' : 'default',
        perspective: 1000,
      }}
      variants={variants}
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={index === 0 ? [animateVariant, { y: [0, -8, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }] : animateVariant}
      exit="exit"
      drag={index === 0 ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={index === 0 ? { cursor: 'grabbing', scale: 1.02 } : {}}
      className="absolute w-full h-full bg-[#111010] border border-[#d4a052] rounded-[24px] flex items-center justify-center p-6 sm:p-8 text-center shadow-2xl"
    >
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[#d4a052] text-lg sm:text-xl opacity-80">✦</div>
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#d4a052] text-lg sm:text-xl opacity-80">✦</div>
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-[#d4a052] text-lg sm:text-xl opacity-80">✦</div>
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[#d4a052] text-lg sm:text-xl opacity-80">✦</div>
      
      {/* Texture overlay */}
      <div 
        className="absolute inset-0 rounded-[24px] pointer-events-none opacity-15"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Decorative border inset */}
      <div className="absolute inset-2 sm:inset-3 border border-[#d4a052] border-opacity-30 rounded-[18px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-6 sm:py-8">
        <div className="mb-2 sm:mb-4 opacity-50">
             <span className="text-[#d4a052] text-xl sm:text-2xl">☾</span>
        </div>
        
        <p className="font-playfair text-[#f5f0e5] text-lg sm:text-xl md:text-2xl font-bold leading-relaxed px-1 sm:px-2 drop-shadow-lg select-none">
          {question}
        </p>
        
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2">
            <div className="w-8 sm:w-12 h-[1px] bg-[#c08b45] opacity-50"></div>
            <p className="text-[#c08b45] text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-mulish font-semibold">
                Deep Talk
            </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function CoupleQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  useEffect(() => {
    setQuestions(shuffle(coupleQuestions));
  }, []);

  const handleSwipe = (swipeDirection) => {
    setDirection(swipeDirection);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };
  
  // Need at least a few cards to show the stack effect properly
  // We'll render the current card and the next 2 cards
  const visibleQuestions = [];
  if (questions.length > 0) {
      for (let i = 0; i < 3; i++) {
          visibleQuestions.push({
              question: questions[(currentIndex + i) % questions.length],
              id: (currentIndex + i) % questions.length
          });
      }
  }

  return (
    <>
      <Metadata
        title="Couple Questions - Deep Talk"
        description="Những câu hỏi sâu sắc giúp các cặp đôi hiểu nhau hơn."
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col font-sans relative overflow-x-hidden">
        {/* Floating Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -50, 0], 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,160,82,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-[80px]"
          />
          
          <motion.div 
            animate={{ 
              x: [0, -80, 0], 
              y: [0, 60, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(192,139,69,0.1)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-[80px]"
          />
        </div>

        <div className="relative z-10 w-full flex flex-col min-h-screen">
          <AppNavbar />

          <div className="flex-1 flex flex-col items-center justify-center relative py-12 px-4 mt-8 md:mt-0">
            <div className="text-center z-10 mb-8">
               <h1 className="font-playfair text-[#f5f0e5] text-3xl sm:text-4xl tracking-wider mb-3 drop-shadow-md">
                  COUPLE QUESTIONS
               </h1>
               <p className="font-mulish text-[#c08b45] text-xs sm:text-sm tracking-[0.4em] uppercase opacity-90">
                  Hiểu nhau sâu sắc hơn
               </p>
            </div>

            <div className="relative w-[85vw] h-[55vh] max-w-[300px] max-h-[450px] flex items-center justify-center">
              <AnimatePresence custom={direction}>
               {visibleQuestions.slice().reverse().map((item, index) => {
                   const stackIndex = visibleQuestions.length - 1 - index;
                   
                    return (
                      <CardStack
                        key={item.id} 
                        question={item.question}
                        index={stackIndex}
                        onSwipe={handleSwipe}
                      />
                    );
                })}
              </AnimatePresence>
            </div>

            <div className="mt-12 z-10">
               <Button
                  variant="bordered"
                  className="bg-[#d4a052] text-[#0b0a0a] hover:bg-[#c08b45] border-none rounded-full w-16 h-16 flex items-center justify-center shadow-[0_0_20px_rgba(212,160,82,0.3)] transition-colors"
                  onClick={() => handleSwipe('right')}
                  aria-label="Next"
               >
                  <span className="text-2xl">➜</span>
               </Button>
            </div>
            
             <p className="mt-8 text-white/30 text-xs tracking-widest font-mulish uppercase">
                Swipe or click to next
             </p>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}
