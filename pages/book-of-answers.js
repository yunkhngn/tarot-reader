import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/react';
import Book3D from '../components/BookOfAnswers/Book3D';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';

export default function BookOfAnswers() {
  const [state, setState] = useState('GUIDE'); 
  const [answer, setAnswer] = useState('');
  const [showGuide, setShowGuide] = useState(true);

  const steps = [
    { num: '(1)', text: 'Đặt tay lên bìa cuốn sách.' },
    { num: '(2)', text: 'Nhắm mắt, hoàn toàn tập trung vào điều bạn muốn hỏi.' },
    { num: '(3)', text: 'Đặt một câu hỏi (nói to hoặc hình dung trong đầu), tay vuốt theo mép sách.' },
    { num: '(4)', text: 'Khi trực giác mách bảo thời điểm thích hợp, hãy mở sách và bạn sẽ có câu trả lời.' },
    { num: '(5)', text: 'Lặp lại quy trình cho các câu hỏi khác.' },
  ];

  const handleStart = () => {
    setShowGuide(false);
    setState('READY');
  };

  const handleBookClick = async () => {
    if (state === 'REVEALED') {
      // Reset logic
      setState('IDLE');
      setTimeout(() => setState('READY'), 500);
      return;
    }

    if (state !== 'READY') return;

    setState('ANALYZING');
    
    // Simulate thinking/connection time
    setTimeout(async () => {
      try {
        const res = await fetch('/api/book-of-answers');
        const data = await res.json();
        setAnswer(data.answer);
        
        setState('OPENING');
        setTimeout(() => {
          setState('REVEALED');
        }, 1500); // Wait for open animation to finish
      } catch (error) {
        console.error('Error fetching answer:', error);
        setState('READY');
      }
    }, 2000);
  };

  return (
    <>
      <Metadata 
        title="Sách Vị Thần Của Những Quyết Định - Book of Answers"
        description="Đặt câu hỏi và nhận câu trả lời từ cuốn sách của định mệnh."
        image="/tarot.jpeg"
      />
      
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col overflow-hidden relative">
        <AppNavbar />

        {/* Ambient Background Effects */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c08b45]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

        <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
          
          <Book3D 
            state={state} 
            answer={answer} 
            onBookClick={handleBookClick} 
          />

          <AnimatePresence>
            {state === 'REVEALED' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-16 text-center"
              >
                <Button 
                  onClick={handleBookClick}
                  className="bg-transparent border border-[#c08b45]/50 text-[#c08b45] hover:bg-[#c08b45]/10 px-8 py-3 rounded-full tracking-widest text-xs uppercase"
                >
                  Đóng sách & Hỏi tiếp
                </Button>
              </motion.div>
            )}

            {state === 'READY' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-16 text-center"
              >
                <p className="text-[#555] text-sm italic font-serif">
                  "Hãy tập trung vào câu hỏi của bạn..."
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Guide Overlay */}
        <AnimatePresence>
          {showGuide && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            >
              <div className="bg-[#1a1a1a] border border-[#333] max-w-lg w-full rounded-2xl p-6 sm:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto scrollbar-hide">
                <h2 className="text-xl sm:text-3xl font-serif text-[#f5f0e5] text-center mb-6 sm:mb-10 tracking-wide uppercase sticky top-0 bg-[#1a1a1a] py-2 z-10">
                  Hướng Dẫn <br/> Sử Dụng Cuốn Sách
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {steps.map((step, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="flex gap-4 text-[#ccc]"
                    >
                      <span className="font-serif text-[#c08b45] shrink-0">{step.num}</span>
                      <p className="text-sm sm:text-base font-light leading-relaxed">{step.text}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <Button 
                    onClick={handleStart}
                    className="bg-[#c08b45] text-black font-semibold hover:bg-[#d4a052] px-10 py-6 rounded-xl text-lg shadow-[0_0_20px_rgba(192,139,69,0.3)] hover:scale-105 transition-all"
                  >
                    Tôi đã hiểu
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
