import React, { useState } from 'react';
import { CardState } from '../types';
import { PRESETS } from '../constants';
import { Type, Palette, X } from 'lucide-react';
import ContentTab from './control-panel/ContentTab';
import StyleTab from './control-panel/StyleTab';

interface ControlPanelProps {
  state: CardState;
  setState: React.Dispatch<React.SetStateAction<CardState>>;
  isMobile: boolean;
  onClose?: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, setState, isMobile, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

  const handleChange = (key: keyof CardState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (confirm('确定要重置所有内容吗？这将清除当前的草稿。')) {
      localStorage.removeItem('rednote-draft');
      window.location.reload();
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
          <ContentTab
            state={state}
            handleChange={handleChange}
            onReset={handleReset}
            onLoadPreset={loadPreset}
          />
        )}

        {/* Style Tab */}
        {activeTab === 'style' && (
          <StyleTab state={state} handleChange={handleChange} />
        )}
      </div>
    </div>
  );
};

export default ControlPanel;