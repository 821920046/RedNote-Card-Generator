import React, { useState } from 'react';
import { CardState } from '../../types';
import { THEME_GROUPS, LAYOUTS, RATIOS, FONTS } from '../../constants';
import { ImageIcon, X, AlignLeft } from 'lucide-react';

interface StyleTabProps {
    state: CardState;
    handleChange: (key: keyof CardState, value: any) => void;
}

const StyleTab: React.FC<StyleTabProps> = ({ state, handleChange }) => {
    const [expandedThemeGroup, setExpandedThemeGroup] = useState<string | null>(null);

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

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Background Image Upload */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">背景图片</label>
                <div className="flex gap-2">
                    <label htmlFor="input-bg-image" className="flex-1 cursor-pointer group">
                        <input id="input-bg-image" name="backgroundImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
                        <label htmlFor="toggle-auto-fontsize" className="relative inline-flex items-center cursor-pointer">
                            <input id="toggle-auto-fontsize" name="autoFontSize" type="checkbox" checked={state.autoFontSize} onChange={(e) => handleChange('autoFontSize', e.target.checked)} className="sr-only peer" />
                            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <label htmlFor="input-line-height" className="text-xs text-gray-500 w-12 text-right">行高</label>
                        <input
                            id="input-line-height"
                            name="lineHeight"
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
                        <label htmlFor="input-letter-spacing" className="text-xs text-gray-500 w-12 text-right">间距</label>
                        <input
                            id="input-letter-spacing"
                            name="letterSpacing"
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
                        <label htmlFor="input-paragraph-spacing" className="text-xs text-gray-500 w-12 text-right">段后</label>
                        <input
                            id="input-paragraph-spacing"
                            name="paragraphSpacing"
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
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom Colors (Conditional) */}
            {state.theme === 'custom' && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                        <label htmlFor="input-custom-bgcolor" className="text-sm text-gray-600">背景色</label>
                        <input id="input-custom-bgcolor" name="customBgColor" type="color" value={state.customBgColor} onChange={e => handleChange('customBgColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="input-custom-textcolor" className="text-sm text-gray-600">文字色</label>
                        <input id="input-custom-textcolor" name="customTextColor" type="color" value={state.customTextColor} onChange={e => handleChange('customTextColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="input-custom-accentcolor" className="text-sm text-gray-600">装饰色</label>
                        <input id="input-custom-accentcolor" name="customAccentColor" type="color" value={state.customAccentColor} onChange={e => handleChange('customAccentColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                    </div>
                </div>
            )}

            {/* Font & Size */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="select-font" className="text-xs font-bold text-gray-400 uppercase tracking-wider">字体</label>
                    <select
                        id="select-font"
                        name="font"
                        value={state.font}
                        onChange={(e) => handleChange('font', e.target.value)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-red-100"
                    >
                        {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">字号</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {[{ id: 'small', label: '小' }, { id: 'normal', label: '中' }, { id: 'large', label: '大' }].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => handleChange('fontSize', s.id as any)}
                                className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${state.fontSize === s.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                    }`}
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
        </div >
    );
};

export default StyleTab;
