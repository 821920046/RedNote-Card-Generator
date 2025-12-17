import React, { useState, useRef, useEffect, useMemo } from 'react';

import { CardState } from './types';
import { RATIOS } from './constants';
import { processContent } from './utils/contentProcessor';
import ControlPanel from './components/ControlPanel';
import MobileDrawer from './components/MobileDrawer';
import CardPreview from './components/CardPreview';
import { Download, Edit2, X, Sparkles, Loader2, Share2, Check, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { insertEmojis, applyPaginationRules } from './utils/contentProcessor';

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
    showLogo: false,
    logoUrl: '',
    logoPosition: 'top-left',
    logoSize: 48,
    logoOpacity: 0.9,
    showWatermark: false,
    watermarkText: 'RedNote',
    watermarkPosition: 'center',
    watermarkOpacity: 0.12,
    showDate: true,
    // Typography Defaults
    lineHeight: 1.75,
    letterSpacing: 0,
    paragraphSpacing: 12,
    textAlign: 'left',
    autoFontSize: true,
    exportEngine: 'html-to-image',
    exportFormat: 'png',
    autoEmoji: true,
    autoPaginate: true,
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rednote-draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force upgrade to html-to-image for better compatibility with gradient texts
        if (parsed.exportEngine === 'html2canvas') {
          parsed.exportEngine = 'html-to-image';
        }
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
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isMobileEditOpen, setIsMobileEditOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [measureContent, setMeasureContent] = useState<string>('');
  const [autoSlides, setAutoSlides] = useState<string[] | null>(null);
  const [past, setPast] = useState<CardState[]>([]);
  const [future, setFuture] = useState<CardState[]>([]);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);

  // --- Pagination Logic ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // Process content with auto-pagination and emoji insertion
  const processedContent = useMemo(() => {
    if (state.autoPaginate || state.autoEmoji) {
      return processContent(state.content, state.aspectRatio, state.autoEmoji);
    }
    return state.content;
  }, [state.content, state.aspectRatio, state.autoEmoji, state.autoPaginate]);

  // Split content by divider '===' (either manual or auto-generated)
  const slides = processedContent.split(/\n={3,}\n/).map(s => s.trim()).filter(s => s.length > 0);

  // Reset current slide if out of bounds (e.g. after editing)
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const currentContent = slides[currentSlide] || processedContent;

  // Responsive check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const applySetState: React.Dispatch<React.SetStateAction<CardState>> = (action) => {
    setState(prev => {
      const next = typeof action === 'function' ? (action as (p: CardState) => CardState)(prev) : action;
      setPast(p => [...p, prev]);
      setFuture([]);
      return next;
    });
  };
  const undo = () => {
    setPast(p => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture(f => [state, ...f]);
      setState(prev);
      return p.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture(f => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast(p => [...p, state]);
      setState(next);
      return f.slice(1);
    });
  };
  const saveDraft = () => {
    const listRaw = localStorage.getItem('rednote-history') || '[]';
    const list = JSON.parse(listRaw);
    const item = { id: String(Date.now()), timestamp: Date.now(), state };
    const next = [item, ...list].slice(0, 50);
    localStorage.setItem('rednote-history', JSON.stringify(next));
    setIsDraftsOpen(true);
  };
  const loadDrafts = (): { id: string; timestamp: number; state: CardState }[] => {
    try { return JSON.parse(localStorage.getItem('rednote-history') || '[]'); } catch { return []; }
  };
  const deleteDraft = (id: string) => {
    const list = loadDrafts().filter(d => d.id !== id);
    localStorage.setItem('rednote-history', JSON.stringify(list));
  };

  useEffect(() => {
    const shouldPaginate = state.autoPaginate && ['quote'].indexOf(state.layout) === -1;
    if (!shouldPaginate) {
      setAutoSlides(null);
      return;
    }
    let mounted = true;
    const compute = async () => {
      await new Promise(r => setTimeout(r, 0));
      if (document.fonts) await document.fonts.ready;
      await new Promise(r => setTimeout(r, 0));
      const measureArea = measureRef.current?.querySelector('#content-area') as HTMLElement | null;
      if (!measureArea) {
        setAutoSlides(null);
        return;
      }
      const limit = measureArea.clientHeight;
      let sourceContent = state.content;
      if (state.autoEmoji) {
        sourceContent = insertEmojis(sourceContent);
      }
      let lines = sourceContent.split('\n');
      lines = applyPaginationRules(lines, state.layout);
      const segments: string[][] = [];
      let current: string[] = [];
      for (const ln of lines) {
        if (ln.trim() === '===') {
          segments.push(current);
          current = [];
          continue;
        }
        current.push(ln);
      }
      segments.push(current);

      const pages: string[] = [];
      for (const seg of segments) {
        let start = 0;
        while (start < seg.length) {
          let low = 1;
          let high = seg.length - start;
          let fit = 1;
          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            setMeasureContent(seg.slice(start, start + mid).join('\n'));
            await new Promise(r => setTimeout(r, 0));
            const area = measureRef.current?.querySelector('#content-area') as HTMLElement | null;
            if (!area) break;
            const h = area.scrollHeight;
            if (h <= limit) {
              fit = mid;
              low = mid + 1;
            } else {
              high = mid - 1;
            }
          }
          const pageText = seg.slice(start, start + fit).join('\n').trim();
          if (pageText) pages.push(pageText);
          start += fit;
        }
      }
      if (mounted) setAutoSlides(pages);
    };
    compute();
    return () => { mounted = false; };
  }, [
    state.autoPaginate,
    state.content,
    state.layout,
    state.font,
    state.fontSize,
    state.lineHeight,
    state.letterSpacing,
    state.paragraphSpacing,
    state.textAlign,
    state.aspectRatio,
    state.theme,
    state.backgroundImage,
    state.title,
    state.subtitle,
    isMobile
  ]);

  // --- Image Generation Logic ---
  const handleDownload = async () => {
    if (isGenerating || !cardRef.current) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    setExportError(null);
    setExportProgress(5);

    try {
      // 1. Get the actual content div
      await new Promise(resolve => setTimeout(resolve, 50));
      setExportProgress(15);
      const elementToCapture = cardRef.current.querySelector('#capture-target') as HTMLElement;
      if (!elementToCapture) throw new Error("Capture target not found");

      // 2. Wait for fonts
      if (document.fonts) await document.fonts.ready;
      setExportProgress(30);
      await new Promise(resolve => setTimeout(resolve, 200));

      // 3. Determine Scale based on DPR
      const scale = isMobile ? 2 : 3; // Reduced mobile scale slightly for stability
      let dataUrl = '';
      let success = false;

      // Helper for timeout
      const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms))
        ]);
      };

      // Try html-to-image first if configured
      if (state.exportEngine === 'html-to-image' && state.exportFormat === 'png') {
        try {
          const { toPng } = await import('html-to-image');
          setExportProgress(60);
          
          dataUrl = await withTimeout(
            toPng(elementToCapture, { 
              cacheBust: true, 
              pixelRatio: scale, 
              quality: 1.0,
              skipAutoScale: true,
              // Filter out non-visible elements to reduce work
              filter: (node) => {
                return !node.classList?.contains('exclude-from-capture');
              }
            }),
            5000, // 5s timeout
            'html-to-image'
          );
          
          success = true;
        } catch (error) {
          console.warn('html-to-image failed or timed out:', error);
          // Fall through to html2canvas
        }
      }

      // Fallback or default to html2canvas
      if (!success) {
        console.log('Falling back to html2canvas...');
        try {
          const html2canvas = (await import('html2canvas')).default;
          setExportProgress(state.exportEngine === 'html-to-image' ? 70 : 60);
          
          const canvas = await withTimeout(
            html2canvas(elementToCapture, {
              scale: scale,
              useCORS: true,
              backgroundColor: null,
              logging: false, // Enable for debugging if needed
              allowTaint: true,
              scrollY: 0,
              windowWidth: elementToCapture.scrollWidth,
              windowHeight: elementToCapture.scrollHeight,
              ignoreElements: (element) => element.classList.contains('exclude-from-capture'),
              onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById('capture-target');
                if (clonedElement) {
                  clonedElement.style.transform = 'none';
                  clonedElement.style.visibility = 'visible';
                  // Force background to be opaque if transparency is causing issues? 
                  // clonedElement.style.backgroundColor = state.customBgColor || '#ffffff';
                }
              }
            }),
            8000, // 8s timeout for html2canvas (it can be slower)
            'html2canvas'
          );
          
          if (state.exportFormat === 'webp') {
            dataUrl = canvas.toDataURL('image/webp', 0.95);
          } else {
            dataUrl = canvas.toDataURL('image/png', 1.0);
          }
          
          if (state.exportFormat === 'pdf') {
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'px',
              format: [canvas.width, canvas.height]
            });
            pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`xhs-card-p${currentSlide + 1}-${Date.now()}.pdf`);
            setExportProgress(100);
            setIsGenerating(false);
            return;
          }
          success = true;
        } catch (err) {
          console.error('html2canvas also failed:', err);
          throw new Error('Image generation failed for both engines. Please try removing external images or simplifying the card.');
        }
      }

      // 4. Output
      setGeneratedImage(dataUrl);
      setExportProgress(100);

      // Desktop: auto download
      if (!isMobile) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `xhs-card-p${currentSlide + 1}-${Date.now()}.${state.exportFormat === 'webp' ? 'webp' : 'png'}`;
        link.click();
      }

    } catch (error) {
      setExportError('生成失败，请重试');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setExportProgress(null), 500);
    }
  };

  const ratioConfig = RATIOS.find(r => r.id === state.aspectRatio) || RATIOS[0];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden font-sans-sc">

      {/* --- Desktop: Left Control Panel --- */}
      <div className="hidden md:block w-[400px] h-full shadow-xl z-20">
        <ControlPanel state={state} setState={applySetState} isMobile={false} />
      </div>

      {/* --- Main Preview Area --- */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Top Bar (Desktop) */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-gray-200 z-10">
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
            {isGenerating ? `生成中 ${exportProgress ?? 0}%` : '下载图片'}
          </button>
          <div className="flex items-center gap-2">
            <button onClick={undo} disabled={past.length === 0} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50">撤销</button>
            <button onClick={redo} disabled={future.length === 0} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50">重做</button>
            <button onClick={saveDraft} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">保存草稿</button>
            <button onClick={() => setIsDraftsOpen(true)} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">草稿库</button>
          </div>
        </div>

        {/* Preview Canvas Container */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto bg-gray-100/50 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

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
            <CardPreview ref={cardRef} state={{ ...state, content: currentContent }} />
          </div>
          <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
            <div
              className="relative"
              style={{
                aspectRatio: `${ratioConfig.value}`,
                height: isMobile ? 'auto' : '85vh',
                width: isMobile ? '85%' : 'auto',
                maxHeight: isMobile ? '70vh' : 'none',
              }}
            >
              <CardPreview ref={measureRef} state={{ ...state, content: measureContent }} />
            </div>
          </div>

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
      {/* --- Mobile: Edit Drawer (Bottom Sheet) --- */}
      {
        isMobile && (
          <MobileDrawer
            isOpen={isMobileEditOpen}
            onClose={() => setIsMobileEditOpen(false)}
            state={state}
            setState={applySetState}
          />
        )
      }

      {/* --- Generated Image Modal (Mobile Optimized) --- */}
      {
        (generatedImage || exportError) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-fade-in">
            <div className="relative w-full max-w-sm flex flex-col items-center">
              <div className="absolute -top-12 right-0">
                <button onClick={() => { setGeneratedImage(null); setExportError(null); }} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition">
                  <X size={24} />
                </button>
              </div>

              {/* Image Container */}
              <div className="bg-gray-800 p-1 rounded-2xl shadow-2xl w-full overflow-hidden border border-gray-700">
                <img src={generatedImage!} alt="Generated Card" className="w-full h-auto rounded-xl block" />
              </div>

              {/* Action / Hint Area */}
              <div className="mt-8 text-center space-y-5 w-full">
                <div className="inline-flex items-center gap-2 text-green-400 font-medium bg-green-950/50 py-2 px-5 rounded-full border border-green-800/50">
                  <Check size={16} />
                  <span>{exportError ? '生成失败' : '图片生成成功'}</span>
                </div>

                {isMobile ? (
                  <div className="flex flex-col gap-3 animate-slide-up">
                    <p className="text-white/70 text-sm flex items-center justify-center gap-2">
                      <Smartphone size={16} />
                      <span>长按上方图片保存到相册</span>
                    </p>

                    {generatedImage && navigator.share && (
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
                    {exportError && (
                      <button
                        onClick={handleDownload}
                        className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg"
                      >
                        重试
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {generatedImage && (
                      <a
                        href={generatedImage}
                        download={`xhs-card-${Date.now()}.${state.exportFormat === 'webp' ? 'webp' : 'png'}`}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
                      >
                        <Download size={20} />
                        下载到本地
                      </a>
                    )}
                    {exportError && (
                      <button
                        onClick={handleDownload}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
                      >
                        重试
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      }

      {isDraftsOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="font-bold">草稿库</div>
              <button onClick={() => setIsDraftsOpen(false)} className="p-2 rounded hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-auto space-y-3">
              {loadDrafts().map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">{new Date(d.timestamp).toLocaleString()}</div>
                    <div className="opacity-70">{d.state.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setState(d.state); setIsDraftsOpen(false); }} className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm">载入</button>
                    <button onClick={() => { deleteDraft(d.id); }} className="px-3 py-1.5 rounded bg-gray-200 text-sm">删除</button>
                  </div>
                </div>
              ))}
              {loadDrafts().length === 0 && (
                <div className="text-center text-gray-500 text-sm">暂无草稿，点击顶部“保存草稿”加入</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;