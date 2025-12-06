import React from 'react';

export type ThemeId = 'minimal' | 'cream' | 'sketch' | 'xhs-red' | 'cherry' | 'sunset' | 'bento' | 'flowing' | 'obsidian' | 'cyber' | 'milkyway' | 'deepsea' | 'forest' | 'aurora' | 'custom';
export type LayoutId = 'list' | 'quote' | 'dict' | 'grid' | 'sketch' | 'minimalist';
export type AspectRatio = '3:4' | '9:16';
export type FontSize = 'small' | 'normal' | 'large';
export type FontId = 'font-sans-sc' | 'font-serif-sc' | 'font-handwriting' | 'font-artistic' | 'font-poster' | 'font-happy' | 'font-calligraphy';

export interface CardState {
  title: string;
  subtitle: string;
  content: string;
  author: string;
  tag: string;
  theme: ThemeId;
  font: FontId;
  layout: LayoutId;
  aspectRatio: AspectRatio;
  fontSize: FontSize;
  customAccentColor: string;
  customTextColor: string;
  customBgColor: string;
  backgroundImage: string | null;
  // QR Code
  showQrCode: boolean;
  qrCodeContent: string;
  // Date
  showDate: boolean;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bg: string; // Tailwind class
  text: string; // Tailwind class
  accent: string; // Tailwind class
  border?: string;
  isGradient: boolean;
  bgStyle?: React.CSSProperties; // For complex gradients not in Tailwind
}

export interface ThemeGroup {
  id: string;
  name: string;
  icon: string;
  previewBg: string;
  themes: ThemeConfig[];
}

export interface Preset {
  id: string;
  name: string;
  icon: React.ReactNode;
  data: Partial<CardState>;
}

// History record for saved cards
export interface CardHistory {
  id: string;
  timestamp: number;
  state: CardState;
  thumbnail?: string;
}
