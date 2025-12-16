import React from 'react';

export type ThemeId = 'minimal' | 'cream' | 'sketch' | 'xhs-red' | 'cherry' | 'sunset' | 'bento' | 'flowing' | 'obsidian' | 'cyber' | 'milkyway' | 'deepsea' | 'forest' | 'aurora' | 'liquidglass' | 'custom';
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
  // Branding
  showLogo: boolean;
  logoUrl: string;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  logoSize: number; // px
  logoOpacity: number; // 0 - 1
  // Watermark
  showWatermark: boolean;
  watermarkText: string;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  watermarkOpacity: number; // 0 - 1
  // QR Code
  showQrCode: boolean;
  qrCodeContent: string;
  // Typography
  lineHeight: number;
  letterSpacing: number;
  paragraphSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  autoFontSize: boolean;

  // Export Settings
  exportEngine: 'html2canvas' | 'html-to-image';
  exportFormat: 'png' | 'webp' | 'pdf';

  // Date
  showDate: boolean;

  // Content Processing
  autoEmoji: boolean;
  autoPaginate: boolean;
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

export interface UserTemplate {
  id: string;
  name: string;
  data: Partial<CardState>;
  createdAt: number;
}
