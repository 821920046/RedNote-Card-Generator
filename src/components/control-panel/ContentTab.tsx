import React from 'react';
import { CardState } from '../../types';
import { PRESETS } from '../../constants';
import { RotateCcw, Calendar, QrCode } from 'lucide-react';

interface ContentTabProps {
    state: CardState;
    handleChange: (key: keyof CardState, value: any) => void;
    onReset: () => void;
    onLoadPreset: (presetId: string) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ state, handleChange, onReset, onLoadPreset }) => {
    return (
        <div className="space-y-5 animate-fade-in">
            {/* Presets - Quick Start */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">快速模版</label>
                    <button onClick={onReset} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition">
                        <RotateCcw size={12} />
                        重置
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(PRESETS).map(preset => (
                        <button
                            key={preset.id}
                            onClick={() => onLoadPreset(preset.id)}
                            className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 transition text-left"
                        >
                            <span className="text-xl">{preset.icon}</span>
                            <span className="text-sm text-gray-700 font-medium">{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="input-title" className="text-sm font-medium text-gray-700">主标题</label>
                <input
                    id="input-title"
                    name="title"
                    type="text"
                    value={state.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition"
                    placeholder="吸引人的标题"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="input-subtitle" className="text-sm font-medium text-gray-700">副标题 / Slogan</label>
                <input
                    id="input-subtitle"
                    name="subtitle"
                    type="text"
                    value={state.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition"
                    placeholder="补充说明"
                />
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <label htmlFor="input-content" className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                    id="input-content"
                    name="content"
                    value={state.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none min-h-[120px] resize-y font-mono text-sm"
                    placeholder="输入正文，换行区分..."
                />
                <p className="text-xs text-gray-400">提示：支持 **加粗**、*斜体*，以 "1." 开头自动变列表</p>
            </div>

            {/* Elements Toggle */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">智能处理</label>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span>✨</span>
                        <span>自动插入 Emoji</span>
                    </div>
                    <label htmlFor="toggle-auto-emoji" className="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-auto-emoji" name="autoEmoji" type="checkbox" checked={state.autoEmoji} onChange={(e) => handleChange('autoEmoji', e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span>📄</span>
                        <span>自动分页</span>
                    </div>
                    <label htmlFor="toggle-auto-paginate" className="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-auto-paginate" name="autoPaginate" type="checkbox" checked={state.autoPaginate} onChange={(e) => handleChange('autoPaginate', e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                </div>
                <p className="text-[10px] text-gray-400">
                    {state.autoPaginate ? `当前比例 ${state.aspectRatio}：基于渲染高度自动分页` : '关闭时需手动插入 === 分隔符'}
                </p>
            </div>

            {/* Display Elements */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">显示元素</label>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={16} />
                        <span>日期日签</span>
                    </div>
                    <label htmlFor="toggle-show-date" className="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-show-date" name="showDate" type="checkbox" checked={state.showDate} onChange={(e) => handleChange('showDate', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <QrCode size={16} />
                        <span>二维码</span>
                    </div>
                    <label htmlFor="toggle-show-qrcode" className="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-show-qrcode" name="showQrCode" type="checkbox" checked={state.showQrCode} onChange={(e) => handleChange('showQrCode', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                </div>

                {state.showQrCode && (
                    <div className="animate-fade-in pl-6">
                        <input
                            id="input-qrcode-content"
                            name="qrCodeContent"
                            type="text"
                            value={state.qrCodeContent}
                            onChange={(e) => handleChange('qrCodeContent', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 outline-none"
                            placeholder="二维码链接或内容"
                            aria-label="二维码内容"
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div className="space-y-1">
                    <label htmlFor="input-author" className="text-sm font-medium text-gray-700">作者</label>
                    <input
                        id="input-author"
                        name="author"
                        type="text"
                        value={state.author}
                        onChange={(e) => handleChange('author', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="input-tag" className="text-sm font-medium text-gray-700">标签</label>
                    <input
                        id="input-tag"
                        name="tag"
                        type="text"
                        value={state.tag}
                        onChange={(e) => handleChange('tag', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default ContentTab;
