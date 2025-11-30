import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { CardState } from './types';
import { RATIOS } from './constants';
import ControlPanel from './components/ControlPanel';
import CardPreview from './components/CardPreview';
import { Download, Edit2, X, Sparkles, Loader2, Share2, Check, Smartphone, Image as ImageIcon } from 'lucide-react';

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
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isMobileEditOpen, setIsMobileEditOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
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

    try {
      // 1. Get the actual content div
      const elementToCapture = cardRef.current.querySelector('#capture-target') as HTMLElement;
      
      if (!elementToCapture) throw new Error("Capture target not found");

      // 2. Wait for fonts
      await document.fonts.ready;
      // Add a small delay to ensure rendering frames are settled
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3. Determine Scale based on DPR
      const dpr = window.devicePixelRatio || 1;
      // Mobile Safari optimization: Limit scale to prevent canvas crash on large DOMs
      // High-end desktops can handle 3x, Mobile usually 2x is enough/safe
      let scale = isMobile ? Math.min(dpr, 2) : 3;
      
      const canvas = await html2canvas(elementToCapture, {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true, // Allow cross-origin images if useCORS fails (best effort)
        onclone: (clonedDoc) => {
           const clonedElement = clonedDoc.getElementById('capture-target');
           if (clonedElement) {
             // Reset transforms to avoid offset issues
             clonedElement.style.transform = 'none'; 
             // Ensure visible
             clonedElement.style.visibility = 'visible';
           }
        }
      });

      // 4. Output
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      setGeneratedImage(dataUrl);

      // Desktop: auto download
      if (!isMobile) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `xhs-card-${Date.now()}.png`;
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden font-sans-sc">
      
      {/* --- Desktop: Left Control Panel --- */}
      <div className="hidden md:block w-[400px] h-full shadow-xl z-20">
        <ControlPanel state={state} setState={setState} isMobile={false} />
      </div>

      {/* --- Main Preview Area --- */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Top Bar (Desktop) */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-gray-200 z-10">
           <div className="flex items-center gap-2 text-gray-700 font-bold text-lg">
             <div className="p-1.5 bg-red-500 rounded-lg text-white">
                <Sparkles size={18} />
             </div>
             小红书卡片生成器
           </div>
           <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
           >
             {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
             {isGenerating ? '生成中...' : '下载图片'}
           </button>
        </div>

        {/* Preview Canvas Container */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto bg-gray-100/50 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-30" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

          {/* Card Container */}
          <div 
             className="relative shadow-2xl transition-all duration-300 z-10 mx-auto"
             style={{
               aspectRatio: `${ratioConfig.value}`,
               height: isMobile ? 'auto' : '85vh',
               width: isMobile ? '85%' : 'auto',
               maxHeight: isMobile ? '70vh' : 'none',
             }}
          >
             <CardPreview ref={cardRef} state={state} />
          </div>
        </div>

        {/* --- Mobile: Bottom Action Bar --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 pb-8 z-30 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
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
        </div>
      </div>

      {/* --- Mobile: Edit Drawer (Bottom Sheet) --- */}
      {isMobile && (
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
      )}

      {/* --- Generated Image Modal (Mobile Optimized) --- */}
      {generatedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 animate-fade-in">
          <div className="relative w-full max-w-sm flex flex-col items-center">
             <div className="absolute -top-12 right-0">
               <button onClick={() => setGeneratedImage(null)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition">
                 <X size={24} />
               </button>
             </div>
             
             {/* Image Container */}
             <div className="bg-gray-800 p-1.5 rounded-2xl shadow-2xl w-full overflow-hidden">
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
      )}

    </div>
  );
};

export default App;