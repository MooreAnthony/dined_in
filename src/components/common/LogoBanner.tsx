import React from 'react';

const LOGOS = [
  { id: 1, alt: 'Client Logo 1' },
  { id: 2, alt: 'Client Logo 2' },
  { id: 3, alt: 'Client Logo 3' },
  { id: 4, alt: 'Client Logo 4' },
  { id: 5, alt: 'Client Logo 5' },
  { id: 6, alt: 'Client Logo 6' },
  { id: 7, alt: 'Client Logo 7' },
  { id: 8, alt: 'Client Logo 8' },
  { id: 9, alt: 'Client Logo 9' },
  { id: 10, alt: 'Client Logo 10' },
];

export const LogoBanner: React.FC = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto overflow-hidden relative">
      {/* Fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
      
      {/* Scrolling container */}
      <div className="flex gap-10 py-8 animate-scroll hover:pause-animation">
        {/* First set of logos */}
        {LOGOS.map((logo) => (
          <div
            key={logo.id}
            className="flex-shrink-0 w-[120px] h-[60px] bg-gray-100 rounded-lg flex items-center justify-center group transition-all duration-300 hover:bg-gray-200"
          >
            <img
              src={`https://placehold.co/120x60/f3f4f6/9ca3af?text=${logo.alt}`}
              alt={logo.alt}
              className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {LOGOS.map((logo) => (
          <div
            key={`${logo.id}-duplicate`}
            className="flex-shrink-0 w-[120px] h-[60px] bg-gray-100 rounded-lg flex items-center justify-center group transition-all duration-300 hover:bg-gray-200"
          >
            <img
              src={`https://placehold.co/120x60/f3f4f6/9ca3af?text=${logo.alt}`}
              alt={logo.alt}
              className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};