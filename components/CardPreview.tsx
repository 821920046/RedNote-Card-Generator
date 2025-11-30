import React, { forwardRef } from 'react';
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

  // Handle sketch layout specific styles
  const isSketch = state.layout === 'sketch';
  const sketchBorderStyle = isSketch ? {
    border: '4px dashed',
    borderColor: state.theme === 'custom' ? state.customTextColor : (themeConfig.id === 'sketch' ? '#B0A294' : 'currentColor'),
    boxShadow: '6px 6px 0 0 rgba(0,0,0,0.1)',
  } : {};

  // Content parsing helper
  const renderContent = () => {
    return state.content.split('\n').map((line, index) => {
      // List detection (1. ...)
      const isListItem = /^\d+\.\s/.test(line.trim());
      // Chinese Grid detection (一. ...)
      const isGridItem = /^[一二三四五六七八九十]\.\s/.test(line.trim());

      if (state.layout === 'list' && isListItem) {
        const [number, ...rest] = line.trim().split('.').map(s => s.trim());
        return (
          <li key={index} className="flex items-start mb-3">
            <span className={`mr-3 flex-shrink-0 font-extrabold ${accentClass}`} style={accentStyle}>{number}.</span>
            <span className={`${textClass} ${sizeConfig.content} leading-relaxed`} style={textStyle}>{rest.join('. ')}</span>
          </li>
        );
      } 
      
      if (state.layout === 'grid' && isGridItem) {
        const [header, ...rest] = line.trim().split('.').map(s => s.trim());
        return (
          <div key={index} className="space-y-1 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <h3 className={`font-bold ${sizeConfig.gridTitle} ${accentClass}`} style={accentStyle}>{header}</h3>
            <p className={`${textClass} text-opacity-80 ${sizeConfig.gridPoint}`} style={textStyle}>{rest.join('. ')}</p>
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
      return <p key={index} className={`${textClass} ${sizeConfig.content} mb-3 leading-relaxed whitespace-pre-wrap`} style={textStyle}>{line}</p>;
    });
  };

  const renderLayout = () => {
    switch (state.layout) {
      case 'list':
        return (
          <div className="flex flex-col h-full">
            <div className="space-y-4 mb-6">
              <h1 className={`${textClass} ${sizeConfig.title} font-extrabold leading-tight tracking-tight`} style={textStyle}>{state.title}</h1>
              <p className={`${accentClass} ${sizeConfig.subtitle} font-light tracking-wider opacity-80`} style={accentStyle}>{state.subtitle}</p>
              <div className={`h-1.5 w-20 rounded-full ${accentClass}`} style={{backgroundColor: accentStyle.color, ...accentStyle}}></div>
            </div>
            <ul className="flex-grow overflow-hidden">
              {renderContent()}
            </ul>
          </div>
        );

      case 'quote':
        return (
          <div className="flex flex-col justify-center items-center text-center h-full space-y-8">
            <Quote size={48} className={`${accentClass} opacity-80`} style={accentStyle} />
            <blockquote className={`${textClass} ${sizeConfig.quote} font-serif-sc font-bold leading-tight px-4`} style={textStyle}>
               {state.content}
            </blockquote>
            <p className={`text-xl font-artistic ${accentClass}`} style={accentStyle}>— {state.subtitle}</p>
          </div>
        );

      case 'dict':
        return (
          <div className="flex flex-col h-full pt-4">
             <div className="mb-8 border-b-2 pb-4 border-opacity-20" style={{borderColor: textStyle.color || 'currentColor'}}>
                <p className={`text-lg font-artistic opacity-80 mb-2 ${accentClass}`} style={accentStyle}>{state.subtitle || 'Definition'}</p>
                <h1 className={`${textClass} ${sizeConfig.dict} font-extrabold leading-none`} style={textStyle}>{state.title}</h1>
             </div>
             <div className={`flex-grow p-6 bg-white/5 rounded-lg border-l-4 ${themeConfig.border || 'border-gray-200'}`} style={{ borderLeftColor: accentStyle.color }}>
                {renderContent()}
             </div>
          </div>
        );

      case 'grid':
        return (
          <div className="flex flex-col h-full space-y-6">
             <div className="text-center">
                <h1 className={`${textClass} ${sizeConfig.title} font-extrabold leading-tight`} style={textStyle}>{state.title}</h1>
                <p className={`${accentClass} ${sizeConfig.subtitle} opacity-70 mt-2`} style={accentStyle}>{state.subtitle}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow content-start">
                {renderContent()}
             </div>
          </div>
        );

      case 'sketch':
        return (
          <div className="flex flex-col h-full p-2" style={sketchBorderStyle}>
             <div className="flex items-start mb-6 pt-4 px-2">
                <Sparkles size={40} className={accentClass} style={accentStyle} />
                <h1 className={`${textClass} ${sizeConfig.sketchTitle} font-handwriting font-bold leading-tight ml-4`} style={textStyle}>
                    {state.title}
                </h1>
             </div>
             <div className="flex-grow space-y-4 pl-6 border-l-2 border-dashed border-opacity-50" style={{ borderColor: accentStyle.color || 'currentColor' }}>
                 {renderContent()}
             </div>
             <p className={`mt-6 text-sm italic font-handwriting text-right opacity-70 ${accentClass}`} style={accentStyle}>—— {state.subtitle}</p>
          </div>
        );

      case 'minimalist':
        return (
           <div className="flex flex-col justify-between h-full py-4">
              <div className="space-y-6 text-center">
                  <p className={`${accentClass} ${sizeConfig.minimalistSubtitle} font-light tracking-[0.2em] uppercase`} style={accentStyle}>{state.subtitle}</p>
                  <h1 className={`${textClass} ${sizeConfig.minimalistTitle} font-serif-sc font-thin leading-tight`} style={textStyle}>{state.title}</h1>
              </div>
              <div className="flex-grow flex items-center justify-center text-center px-8">
                  <div className="max-w-md">
                      {renderContent()}
                  </div>
              </div>
              <div className="flex justify-center items-center pt-4 opacity-50">
                  <div className={`h-px w-16 bg-current mr-4 ${accentClass}`} style={accentStyle}></div>
                  <div className={`h-px w-16 bg-current ml-4 ${accentClass}`} style={accentStyle}></div>
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
      // Important: Aspect ratio is handled by parent or container, but we set explicit dimensions for capture consistency if needed
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: 'transparent' // Container is transparent, inner div has bg
      }}
    >
      <div 
        id="capture-target"
        className={`w-full h-full flex flex-col justify-between p-8 md:p-10 lg:p-12 relative ${bgClass}`}
        style={cardStyle}
      >
        {renderLayout()}
        
        {/* Footer info (Author/Tag) - hidden in sketch/minimalist sometimes or styled differently */}
        {!['minimalist'].includes(state.layout) && (
          <div className={`mt-4 pt-4 border-t border-dashed border-opacity-30 flex justify-between items-end z-10`}
            style={{ borderColor: textStyle.color || 'rgba(0,0,0,0.2)' }}>
            <span className={`text-sm font-bold opacity-80 ${accentClass}`} style={accentStyle}>{state.author}</span>
            <span className={`text-xs opacity-60 ${textClass}`} style={textStyle}>#{state.tag}</span>
          </div>
        )}
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;
