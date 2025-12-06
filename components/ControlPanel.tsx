import React, { useState } from 'react';
import { CardState, ThemeId, LayoutId, AspectRatio, FontSize } from '../types';
import { THEME_GROUPS, LAYOUTS, RATIOS, FONTS, PRESETS } from '../constants';
import { ChevronDown, ChevronUp, Type, Palette, Layout, Smartphone, Download, Loader2, Sparkles, X, Image as ImageIcon, QrCode, Calendar, RotateCcw, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ControlPanelProps {
  state: CardState;
  setState: React.Dispatch<React.SetStateAction<CardState>>;
  isMobile: boolean;
  onClose?: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, setState, isMobile, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const [expandedThemeGroup, setExpandedThemeGroup] = useState<string | null>(null);

  const handleChange = (key: keyof CardState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (confirm('确定要重置所有内容吗？这将清除当前的草稿。')) {
      localStorage.removeItem('rednote-draft');
      window.location.reload();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('backgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESETS[presetId];
    if (preset) {
      setState(prev => ({ ...prev, ...preset.data }));
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: 'content' | 'style', label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === id ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className={`h-full flex flex-col bg-white ${isMobile ? '' : 'border-r border-gray-200'}`}>
      {/* Header (Mobile Only) */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">编辑卡片</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <TabButton id="content" label="内容" icon={Type} />
        <TabButton id="style" label="样式" icon={Palette} />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 md:pb-6">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-5 animate-fade-in">
            {/* Presets - Quick Start */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">快速模版</label>
                <button onClick={handleReset} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition">
                  <RotateCcw size={12} />
                  重置
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PRESETS).map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset.id)}
                    className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 transition text-left"
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <span className="text-sm text-gray-700 font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">主标题</label>
              <input
                type="text"
                value={state.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition"
                placeholder="吸引人的标题"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">副标题 / Slogan</label>
              <input
                type="text"
                value={state.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition"
                placeholder="补充说明"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>正文内容</span>
                  <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded-full">支持 Markdown</span>
                </label>
                <button
                  onClick={() => {
                    const separator = "\n\n===\n\n";
                    handleChange('content', state.content + separator);
                  }}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition"
                  title="插入分页符"
                >
                  + 插入分页
                </button>
              </div>
              <textarea
                value={state.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none min-h-[120px] resize-y font-mono text-sm"
                placeholder="输入正文，换行区分..."
              />
              <p className="text-xs text-gray-400">提示：支持 **加粗**、*斜体*，以 "1." 开头自动变列表</p>
            </div>

            {/* Elements Toggle */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">显示元素</label>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar size={16} />
                  <span>日期日签</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={state.showDate} onChange={(e) => handleChange('showDate', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <QrCode size={16} />
                  <span>二维码</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={state.showQrCode} onChange={(e) => handleChange('showQrCode', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              {state.showQrCode && (
                <div className="animate-fade-in pl-6">
                  <input
                    type="text"
                    value={state.qrCodeContent}
                    onChange={(e) => handleChange('qrCodeContent', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 outline-none"
                    placeholder="二维码链接或内容"
                  />
                </div>
              )}

              {/* Watermark Settings Removed */}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">作者</label>
                <input
                  type="text"
                  value={state.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">标签</label>
                <input
                  type="text"
                  value={state.tag}
                  onChange={(e) => handleChange('tag', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Style Tab */}
        {activeTab === 'style' && (
          <div className="space-y-6 animate-fade-in">
            {/* Background Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">背景图片</label>
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-500 transition hover:bg-red-50">
                    <ImageIcon size={20} className="mb-1" />
                    <span className="text-xs">上传图片</span>
                  </div>
                </label>
                {state.backgroundImage && (
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-gray-200">
                    <img src={state.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleChange('backgroundImage', null)}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              {state.backgroundImage && (
                <p className="text-xs text-gray-400">背景图模式下，建议使用【自定义】主题调整文字颜色以确保清晰度。</p>
              )}
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">配色主题</label>
              <div className="grid grid-cols-5 gap-2">
                {THEME_GROUPS.map(group => {
                  const isActive = expandedThemeGroup === group.id || (!expandedThemeGroup && group.themes.some(t => t.id === state.theme));
                  return (
                    <button
                      key={group.id}
                      onClick={() => setExpandedThemeGroup(expandedThemeGroup === group.id ? null : group.id)}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all border-2 ${isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100 hover:border-gray-200'
                        } ${group.previewBg}`}
                    >
                      {group.icon}
                    </button>
                  );
                })}
              </div>

              {/* Expanded Theme Options */}
              {expandedThemeGroup && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-3 gap-2 animate-slide-up">
                  {THEME_GROUPS.find(g => g.id === expandedThemeGroup)?.themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        handleChange('theme', theme.id);
                        // Don't close immediately for better UX
                      }}
                      className={`h-12 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${state.theme === theme.id ? 'border-red-500 text-red-600 bg-white shadow-sm' : 'border-transparent hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Layout Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">排版布局</label>
              <div className="grid grid-cols-3 gap-2">
                {LAYOUTS.map(layout => (
                  <button
                    key={layout.id}
                    onClick={() => handleChange('layout', layout.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${state.layout === layout.id
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-100 hover:bg-gray-50 text-gray-500'
                      }`}
                  >
                    <layout.icon size={20} className="mb-1" />
                    <span className="text-xs">{layout.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Controls */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">微调排版</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">智能字号</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={state.autoFontSize} onChange={(e) => handleChange('autoFontSize', e.target.checked)} className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-12 text-right">行高</span>
                  <input
                    type="range"
                    min="1.0"
                    max="2.5"
                    step="0.05"
                    value={state.lineHeight}
                    onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 w-8 tabular-nums">{state.lineHeight.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-12 text-right">间距</span>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={state.letterSpacing}
                    onChange={(e) => handleChange('letterSpacing', parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 w-8 tabular-nums">{state.letterSpacing}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-12 text-right">段后</span>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="2"
                    value={state.paragraphSpacing}
                    onChange={(e) => handleChange('paragraphSpacing', parseInt(e.target.value))}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 w-8 tabular-nums">{state.paragraphSpacing}</span>
                </div>

                <div className="flex items-center gap-3 justify-end pt-1">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => handleChange('textAlign', align)}
                      className={`p-1.5 rounded transition ${state.textAlign === align ? 'bg-gray-200 text-black' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={align === 'left' ? '左对齐' : align === 'center' ? '居中' : '右对齐'}
                    >
                      {align === 'left' ? <AlignLeft size={14} /> : align === 'center' ? <AlignLeft size={14} className="rotate-90" /> : <AlignLeft size={14} className="scale-x-[-1]" />}
                      {/* Using AlignLeft rotatated/flipped as a quick hack or better icons if imported */}
                      {/* Let's re-import icons cleanly next chance, for now use similar look or text */}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Colors (Conditional) */}
            {state.theme === 'custom' && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">背景色</span>
                  <input type="color" value={state.customBgColor} onChange={e => handleChange('customBgColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">文字色</span>
                  <input type="color" value={state.customTextColor} onChange={e => handleChange('customTextColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">装饰色</span>
                  <input type="color" value={state.customAccentColor} onChange={e => handleChange('customAccentColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                </div>
              </div>
            )}

            {/* Font & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">字体</label>
                <select
                  value={state.font}
                  onChange={(e) => handleChange('font', e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-100"
                >
                  {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">字号</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {[{ id: 'small', label: '小' }, { id: 'normal', label: '中' }, { id: 'large', label: '大' }].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleChange('fontSize', s.id)}
                      className={`flex-1 py-1 text-xs rounded-md transition-all ${state.fontSize === s.id ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">尺寸</label>
              <div className="grid grid-cols-2 gap-2">
                {RATIOS.map(ratio => (
                  <button
                    key={ratio.id}
                    onClick={() => handleChange('aspectRatio', ratio.id)}
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-sm transition ${state.aspectRatio === ratio.id ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <ratio.icon size={14} />
                    {ratio.name} <span className="text-xs opacity-60">({ratio.label})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;