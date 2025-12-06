import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { CardState, ThemeConfig } from '../types';
import { THEME_GROUPS, FONT_SIZE_MAP } from '../constants';
import { Quote, Sparkles } from 'lucide-react';

interface CardPreviewProps {
  state: CardState;
  className?: string;
  scale?: number;
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ state, className = '', scale = 1 }, ref) => {
  // Find current theme config
  const allThemes = THEME_GROUPS.flatMap(g => g.themes);
  const themeConfig = allThemes.find(t => t.id === state.theme) || allThemes[0];
  const sizeConfig = FONT_SIZE_MAP[state.fontSize] || FONT_SIZE_MAP.normal;

  // --- Dynamic Style Calculation ---
  let bgClass = themeConfig.bg;
  let textClass = themeConfig.text;
  let accentClass = themeConfig.accent;
  let accentStyle: React.CSSProperties = {};
  let cardStyle: React.CSSProperties = {};
  let textStyle: React.CSSProperties = {};

  // Custom styles override
  if (state.theme === 'custom') {
    if (state.customBgColor.includes('gradient')) {
      cardStyle.background = state.customBgColor;
    } else {
      cardStyle.backgroundColor = state.customBgColor;
    }
    textStyle.color = state.customTextColor;
    accentStyle.color = state.customAccentColor;
    bgClass = '';
    textClass = '';
    accentClass = '';
  } else if (themeConfig.bgStyle) {
    cardStyle = themeConfig.bgStyle;
    bgClass = '';
  }

  // Handle Background Image Override
  if (state.backgroundImage) {
    cardStyle = {
      ...cardStyle,
      backgroundImage: `url(${state.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
    bgClass = ''; // Remove tailwind bg class
  }

  // Handle sketch layout specific styles
  const isSketch = state.layout === 'sketch';
  const sketchBorderStyle = isSketch ? {
    border: '3px dashed', // Slightly thinner on mobile
    borderColor: state.theme === 'custom' ? state.customTextColor : (themeConfig.id === 'sketch' ? '#B0A294' : 'currentColor'),
    boxShadow: '4px 4px 0 0 rgba(0,0,0,0.1)',
  } : {};

  // Content parsing helper
  const renderContent = () => {
    return state.content.split('\n').map((line, index) => {
      // List detection (1. ...)
      const isListItem = /^\d+\.\s/.test(line.trim());
      // Chinese Grid detection (一. ...)
      const isGridItem = /^[一二三四五六七八九十]\.\s/.test(line.trim());

      const bgOpacityClass = state.backgroundImage ? 'bg-white/80 backdrop-blur-sm shadow-sm' : 'bg-white/10 border-white/20';

      if (state.layout === 'list' && isListItem) {
        const [number, ...rest] = line.trim().split('.').map(s => s.trim());
        return (
          <li key={index} className={`flex items-start mb-3 p-2 rounded-lg ${state.backgroundImage ? 'bg-white/60 backdrop-blur-sm' : ''}`}>
            <span className={`mr-2 md:mr-3 flex-shrink-0 font-extrabold ${accentClass}`} style={accentStyle}>{number}.</span>
            <span className={`${textClass} ${sizeConfig.content} leading-relaxed`} style={textStyle}>
              <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>{rest.join('. ')}</ReactMarkdown>
            </span>
          </li>
        );
      }

      if (state.layout === 'grid' && isGridItem) {
        const [header, ...rest] = line.trim().split('.').map(s => s.trim());
        return (
          <div key={index} className={`space-y-1 p-3 md:p-4 rounded-xl ${state.backgroundImage ? 'bg-white/90 backdrop-blur-md text-gray-800' : 'bg-white/10 backdrop-blur-sm border border-white/20'}`}>
            <h3 className={`font-bold ${sizeConfig.gridTitle} ${accentClass}`} style={accentStyle}>{header}</h3>
            <div className={`${state.backgroundImage ? 'text-gray-700' : textClass} text-opacity-80 ${sizeConfig.gridPoint}`} style={state.backgroundImage ? {} : textStyle}>
              <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>{rest.join('. ')}</ReactMarkdown>
            </div>
          </div>
        );
      }

      if (state.layout === 'sketch') {
        return (
          <p key={index} className={`${textClass} ${sizeConfig.sketchContent} mb-2 font-handwriting`} style={textStyle}>
            {line}
          </p>
        );
      }

      if (state.layout === 'minimalist') {
        return (
          <p key={index} className={`${textClass} ${sizeConfig.minimalistContent} mb-3 font-light leading-loose tracking-wide`} style={textStyle}>
            {line}
          </p>
        );
      }

      // Default paragraph
      // Default paragraph
      return (
        <div key={index} className={`${textClass} ${sizeConfig.content} mb-3 leading-relaxed whitespace-pre-wrap ${state.backgroundImage && state.layout !== 'grid' ? 'bg-white/50 p-2 rounded backdrop-blur-sm inline-block' : ''}`} style={textStyle}>
          <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>{line}</ReactMarkdown>
        </div>
      );
    });
  };

  // Date Component
  const renderDate = () => {
    if (!state.showDate) return null;
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    return (
      <div className={`absolute top-6 right-6 flex flex-col items-center justify-center p-2 rounded-lg border-2 ${state.backgroundImage ? 'bg-white/90 border-gray-900 text-gray-900' : ''}`} style={{ borderColor: textStyle.color || 'currentColor', color: textStyle.color || 'currentColor', ...textStyle }}>
        <div className="text-xs font-bold uppercase leading-none mb-1">{year}</div>
        <div className="text-2xl font-black leading-none">{day}</div>
        <div className="text-xs font-bold uppercase leading-none mt-1 border-t border-current pt-1 w-full text-center">{month}月</div>
      </div>
    );
  };

  const renderLayout = () => {
    switch (state.layout) {
      case 'list':
        return (
          <div className="flex flex-col flex-1 min-h-0 relative z-10">
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 shrink-0 pr-16">
              <h1 className={`${textClass} ${sizeConfig.title} font-extrabold leading-tight tracking-tight drop-shadow-sm`} style={textStyle}>{state.title}</h1>
              <p className={`${accentClass} ${sizeConfig.subtitle} font-light tracking-wider opacity-80`} style={accentStyle}>{state.subtitle}</p>
              <div className={`h-1.5 w-16 md:w-20 rounded-full ${accentClass}`} style={{ backgroundColor: accentStyle.color, ...accentStyle }}></div>
            </div>
            <ul className="flex-grow overflow-hidden">
              {renderContent()}
            </ul>
          </div>
        );

      case 'quote':
        return (
          <div className="flex flex-col justify-center items-center text-center flex-1 min-h-0 space-y-6 md:space-y-8 relative z-10">
            <Quote size={40} className={`${accentClass} opacity-80 md:w-12 md:h-12`} style={accentStyle} />
            <blockquote className={`${textClass} ${sizeConfig.quote} font-serif-sc font-bold leading-tight px-2 md:px-4 drop-shadow-sm`} style={textStyle}>
              <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>{state.content}</ReactMarkdown>
            </blockquote>
            <p className={`text-lg md:text-xl font-artistic ${accentClass}`} style={accentStyle}>— {state.subtitle}</p>
          </div>
        );

      case 'dict':
        return (
          <div className="flex flex-col flex-1 min-h-0 pt-2 md:pt-4 relative z-10">
            <div className="mb-6 md:mb-8 border-b-2 pb-4 border-opacity-20 shrink-0 pr-12" style={{ borderColor: textStyle.color || 'currentColor' }}>
              <p className={`text-lg font-artistic opacity-80 mb-2 ${accentClass}`} style={accentStyle}>{state.subtitle || 'Definition'}</p>
              <h1 className={`${textClass} ${sizeConfig.dict} font-extrabold leading-none`} style={textStyle}>{state.title}</h1>
            </div>
            <div className={`flex-grow p-4 md:p-6 rounded-lg border-l-4 ${themeConfig.border || 'border-gray-200'} overflow-hidden ${state.backgroundImage ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white/5'}`} style={{ borderLeftColor: accentStyle.color }}>
              {renderContent()}
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="flex flex-col flex-1 min-h-0 space-y-4 md:space-y-6 relative z-10">
            <div className="text-center shrink-0">
              <h1 className={`${textClass} ${sizeConfig.title} font-extrabold leading-tight drop-shadow-sm`} style={textStyle}>{state.title}</h1>
              <p className={`${accentClass} ${sizeConfig.subtitle} opacity-70 mt-2 bg-white/30 rounded inline-block px-2`} style={accentStyle}>{state.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 flex-grow content-start overflow-hidden">
              {renderContent()}
            </div>
          </div>
        );

      case 'sketch':
        return (
          <div className="flex flex-col flex-1 min-h-0 p-2 md:p-3 relative z-10" style={sketchBorderStyle}>
            <div className="flex items-start mb-4 md:mb-6 pt-2 md:pt-4 px-2 shrink-0">
              <Sparkles size={32} className={`${accentClass} md:w-10 md:h-10`} style={accentStyle} />
              <h1 className={`${textClass} ${sizeConfig.sketchTitle} font-handwriting font-bold leading-tight ml-3 md:ml-4`} style={textStyle}>
                {state.title}
              </h1>
            </div>
            <div className="flex-grow space-y-3 md:space-y-4 pl-4 md:pl-6 border-l-2 border-dashed border-opacity-50 overflow-hidden" style={{ borderColor: accentStyle.color || 'currentColor' }}>
              {renderContent()}
            </div>
            <p className={`mt-4 md:mt-6 text-sm italic font-handwriting text-right opacity-70 shrink-0 ${accentClass}`} style={accentStyle}>—— {state.subtitle}</p>
          </div>
        );

      case 'minimalist':
        return (
          <div className="flex flex-col justify-between flex-1 min-h-0 py-2 md:py-4 relative z-10">
            <div className="space-y-4 md:space-y-6 text-center shrink-0">
              <p className={`${accentClass} ${sizeConfig.minimalistSubtitle} font-light tracking-[0.2em] uppercase`} style={accentStyle}>{state.subtitle}</p>
              <h1 className={`${textClass} ${sizeConfig.minimalistTitle} font-serif-sc font-thin leading-tight drop-shadow-sm`} style={textStyle}>{state.title}</h1>
            </div>
            <div className="flex-grow flex items-center justify-center text-center px-4 md:px-8 overflow-hidden">
              <div className={`max-w-md w-full ${state.backgroundImage ? 'bg-white/80 p-6 shadow-xl backdrop-blur-md' : ''}`}>
                {renderContent()}
              </div>
            </div>
            <div className="flex justify-center items-center pt-4 opacity-50 shrink-0">
              <div className={`h-px w-12 md:w-16 bg-current mr-4 ${accentClass}`} style={accentStyle}></div>
              <div className={`h-px w-12 md:w-16 bg-current ml-4 ${accentClass}`} style={accentStyle}></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className={`overflow-hidden shadow-2xl transition-all duration-300 ${state.font} ${className}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
      }}
    >
      <div
        id="capture-target"
        // Updated padding for mobile (p-6) vs desktop (p-10/12)
        className={`w-full h-full flex flex-col justify-between p-6 md:p-10 lg:p-12 relative ${bgClass}`}
        style={cardStyle}
      >
        {/* Render Date Badge */}
        {renderDate()}

        {renderLayout()}

        {/* Footer info (Author/Tag/QR) */}
        {!['minimalist'].includes(state.layout) && (
          <div className={`mt-4 pt-3 md:pt-4 border-t border-dashed border-opacity-30 flex justify-between items-end z-10 shrink-0`}
            style={{ borderColor: textStyle.color || 'rgba(0,0,0,0.2)' }}>

            <div className="flex flex-col">
              <span className={`text-sm font-bold opacity-80 ${accentClass} ${state.backgroundImage ? 'bg-white/80 px-2 py-0.5 rounded' : ''}`} style={accentStyle}>{state.author}</span>
              <span className={`text-xs opacity-60 ${textClass} ${state.backgroundImage ? 'bg-white/60 px-2 py-0.5 rounded mt-1' : ''}`} style={textStyle}>#{state.tag}</span>
            </div>

            {/* QR Code rendering */}
            {state.showQrCode && (
              <div className="p-1 bg-white rounded-lg shadow-sm ml-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(state.qrCodeContent)}`}
                  alt="QR"
                  className="w-12 h-12 md:w-14 md:h-14"
                />
              </div>
            )}
          </div>
        )}

        {/* Watermark Removed */}
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;