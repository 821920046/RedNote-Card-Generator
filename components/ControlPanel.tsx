import React, { useState } from 'react';
import { CardState, ThemeId, LayoutId, AspectRatio, FontSize } from '../types';
import { THEME_GROUPS, LAYOUTS, RATIOS, FONTS, PRESETS } from '../constants';
import { ChevronDown, ChevronUp, Type, Palette, Layout, Smartphone, Download, Loader2, Sparkles, X } from 'lucide-react';

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

  const loadPreset = (presetId: string) => {
    const preset = PRESETS[presetId];
    if (preset) {
      setState(prev => ({ ...prev, ...preset.data }));
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: 'content' | 'style', label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
        activeTab === id ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">快速模版</label>
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
              <label className="text-sm font-medium text-gray-700">正文内容</label>
              <textarea
                value={state.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none min-h-[120px] resize-y"
                placeholder="输入正文，换行区分..."
              />
              <p className="text-xs text-gray-400">提示：以数字 "1." 开头会自动变为列表样式</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                      className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all border-2 ${
                        isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100 hover:border-gray-200'
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
                      className={`h-12 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
                        state.theme === theme.id ? 'border-red-500 text-red-600 bg-white shadow-sm' : 'border-transparent hover:bg-gray-100 text-gray-600'
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
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      state.layout === layout.id 
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
                   {[{id: 'small', label: '小'}, {id: 'normal', label: '中'}, {id: 'large', label: '大'}].map((s) => (
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
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-sm transition ${
                      state.aspectRatio === ratio.id ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
