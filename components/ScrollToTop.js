import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 bg-[#c08b45] hover:bg-[#d4a052] rounded-full shadow-[0_8px_25px_rgba(192,139,69,0.4)] hover:shadow-[0_12px_35px_rgba(192,139,69,0.5)] transition-all duration-300 hover:scale-110 group ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <defs>
          <mask id="crescent-mask">
            <rect width="24" height="24" fill="white" />
            <circle cx="16" cy="12" r="8" fill="black" />
          </mask>
        </defs>
        {/* Crescent moon */}
        <circle cx="12" cy="12" r="10" fill="currentColor" mask="url(#crescent-mask)" />
        {/* Arrow pointing up */}
        <path
          d="M12 8L8 11H10.5V14H13.5V11H16L12 8Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    </button>
  );
}

