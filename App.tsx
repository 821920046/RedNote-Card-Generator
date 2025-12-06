import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import { CardState } from './types';
import { RATIOS } from './constants';
import ControlPanel from './components/ControlPanel';
import CardPreview from './components/CardPreview';
import { Download, Edit2, X, Sparkles, Loader2, Share2, Check, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [state, setState] = useState<CardState>({
    title: '我的生活碎片',
    subtitle: '一些最近发现的小确幸',
    content: '✨ 尝试了新的咖啡店，拿铁味道很棒！\n🎨 开始学习水彩画，虽然手残但很快乐。\n📚 读完一本超棒的书，推荐给你们！',
    author: '@爱画画的丸子',
    tag: '生活日记',
    theme: 'sketch',
    font: 'font-handwriting',
    layout: 'sketch',
    aspectRatio: '3:4',
    fontSize: 'normal',
    customAccentColor: '#FF2442',
    customTextColor: '#1f1f1f',
    customBgColor: '#ffffff',
    backgroundImage: null,
    showQrCode: false,
    qrCodeContent: 'https://www.xiaohongshu.com',
    showDate: true,
    // Typography Defaults
    lineHeight: 1.75,
    letterSpacing: 0,
    paragraphSpacing: 12,
    textAlign: 'left',
    autoFontSize: true,
    exportEngine: 'html2canvas',
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rednote-draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Save to localStorage on change (debounced manually by useEffect dependency)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('rednote-draft', JSON.stringify(state));
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isMobileEditOpen, setIsMobileEditOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Pagination Logic ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // Split content by divider '==='
  const slides = state.content.split(/\n={3,}\n/).map(s => s.trim());

  // Reset current slide if out of bounds (e.g. after editing)
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const currentContent = slides[currentSlide] || state.content;

  // Responsive check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Image Generation Logic ---
  const handleDownload = async () => {
    if (isGenerating || !cardRef.current) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // 1. Get the actual content div
      await new Promise(resolve => setTimeout(resolve, 50));
      const elementToCapture = cardRef.current.querySelector('#capture-target') as HTMLElement;
      if (!elementToCapture) throw new Error("Capture target not found");

      // 2. Wait for fonts
      if (document.fonts) await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 200));

      // 3. Determine Scale based on DPR
      const scale = isMobile ? 3 : 3;
      let dataUrl = '';

      if (state.exportEngine === 'html-to-image') {
        dataUrl = await toPng(elementToCapture, {
          cacheBust: true,
          pixelRatio: scale,
          quality: 1.0,
        });
      } else {
        const canvas = await html2canvas(elementToCapture, {
          scale: scale,
          useCORS: true,
          backgroundColor: null,
          logging: false,
          allowTaint: true,
          scrollY: 0,
          windowWidth: elementToCapture.scrollWidth,
          windowHeight: elementToCapture.scrollHeight,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('capture-target');
            if (clonedElement) {
              clonedElement.style.transform = 'none';
              clonedElement.style.visibility = 'visible';
            }
          }
        });
        dataUrl = canvas.toDataURL('image/png', 1.0);
      }

      // 4. Output
      setGeneratedImage(dataUrl);

      // Desktop: auto download
      if (!isMobile) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `xhs-card-p${currentSlide + 1}-${Date.now()}.png`;
        link.click();
      }

    } catch (error) {
      console.error('Generation failed:', error);
      alert('生成图片失败，请重试或刷新页面');
    } finally {
      setIsGenerating(false);
    }
  };

  const ratioConfig = RATIOS.find(r => r.id === state.aspectRatio) || RATIOS[0];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden font-sans-sc" >

      {/* --- Desktop: Left Control Panel --- */}
      < div className="hidden md:block w-[400px] h-full shadow-xl z-20" >
        <ControlPanel state={state} setState={setState} isMobile={false} />
      </div >

      {/* --- Main Preview Area --- */}
      < div className="flex-1 relative flex flex-col h-full overflow-hidden" >
        {/* Top Bar (Desktop) */}
        < div className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-gray-200 z-10" >
          <div className="flex items-center gap-2 text-gray-700 font-bold text-lg">
            <div className="p-1.5 bg-red-500 rounded-lg text-white">
              <Sparkles size={18} />
            </div>
            RedNote Card Generator
          </div>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {isGenerating ? '生成中...' : '下载图片'}
          </button>
        </div >

        {/* Preview Canvas Container */}
        < div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto bg-gray-100/50 relative" >
          {/* Background pattern */}
          < div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div >

          {/* Card Container */}
          < div
            className="relative shadow-2xl transition-all duration-300 z-10 mx-auto"
            style={{
              aspectRatio: `${ratioConfig.value}`,
              height: isMobile ? 'auto' : '85vh',
              width: isMobile ? '85%' : 'auto',
              maxHeight: isMobile ? '70vh' : 'none',
            }}
          >
            <CardPreview ref={cardRef} state={{ ...state, content: currentContent }} />
          </div >

          {/* Pagination Controls */}
          {
            slides.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 z-20">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium tabular-nums text-gray-700">
                  {currentSlide + 1} / {slides.length}
                </span>
                <button
                  onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )
          }
        </div >

        {/* --- Mobile: Bottom Action Bar --- */}
        < div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 pb-8 z-30 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" >
          <button
            onClick={() => setIsMobileEditOpen(true)}
            className="flex-1 py-3.5 bg-gray-100 text-gray-800 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition active:scale-95"
          >
            <Edit2 size={18} />
            编辑内容
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-100 active:bg-red-600 transition active:scale-95 disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            保存图片
          </button>
        </div >
      </div >

      {/* --- Mobile: Edit Drawer (Bottom Sheet) --- */}
      {
        isMobile && (
          <>
            {/* Backdrop */}
            <div
              className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isMobileEditOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setIsMobileEditOpen(false)}
            />
            {/* Sheet */}
            <div className={`fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[2rem] z-50 transform transition-transform duration-300 cubic-bezier(0.32, 0.72, 0, 1) shadow-2xl flex flex-col ${isMobileEditOpen ? 'translate-y-0' : 'translate-y-full'}`}>
              {/* Handle bar for visual cue */}
              <div className="w-full h-6 flex items-center justify-center pt-2" onClick={() => setIsMobileEditOpen(false)}>
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
              <ControlPanel
                state={state}
                setState={setState}
                isMobile={true}
                onClose={() => setIsMobileEditOpen(false)}
              />
            </div>
          </>
        )
      }

      {/* --- Generated Image Modal (Mobile Optimized) --- */}
      {
        generatedImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-fade-in">
            <div className="relative w-full max-w-sm flex flex-col items-center">
              <div className="absolute -top-12 right-0">
                <button onClick={() => setGeneratedImage(null)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition">
                  <X size={24} />
                </button>
              </div>

              {/* Image Container */}
              <div className="bg-gray-800 p-1 rounded-2xl shadow-2xl w-full overflow-hidden border border-gray-700">
                <img src={generatedImage} alt="Generated Card" className="w-full h-auto rounded-xl block" />
              </div>

              {/* Action / Hint Area */}
              <div className="mt-8 text-center space-y-5 w-full">
                <div className="inline-flex items-center gap-2 text-green-400 font-medium bg-green-950/50 py-2 px-5 rounded-full border border-green-800/50">
                  <Check size={16} />
                  <span>图片生成成功</span>
                </div>

                {isMobile ? (
                  <div className="flex flex-col gap-3 animate-slide-up">
                    <p className="text-white/70 text-sm flex items-center justify-center gap-2">
                      <Smartphone size={16} />
                      <span>长按上方图片保存到相册</span>
                    </p>

                    {navigator.share && (
                      <button
                        onClick={() => {
                          fetch(generatedImage).then(res => res.blob()).then(blob => {
                            const file = new File([blob], "xhs-card.png", { type: "image/png" });
                            navigator.share({
                              files: [file],
                              title: '小红书卡片',
                            }).catch(() => console.log('Share dismissed'));
                          });
                        }}
                        className="w-full py-3.5 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-lg"
                      >
                        <Share2 size={20} />
                        调用系统分享
                      </button>
                    )}
                  </div>
                ) : (
                  <a
                    href={generatedImage}
                    download={`xhs-card-${Date.now()}.png`}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Download size={20} />
                    下载到本地
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default App;