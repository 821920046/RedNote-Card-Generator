import { ThemeGroup, Preset, LayoutId, AspectRatio, FontId, FontSize } from './types';
import { 
  AlignLeft, 
  Quote, 
  BookOpen, 
  LayoutGrid, 
  PenTool, 
  Feather,
  Smartphone,
  Tablet,
  Plane,
  Coffee,
  Clapperboard,
  Languages
} from 'lucide-react';

export const THEME_GROUPS: ThemeGroup[] = [
  {
    id: 'light',
    name: '浅色系',
    icon: '☀️',
    previewBg: 'bg-white',
    themes: [
      { id: 'minimal', name: '极简白', bg: 'bg-white', text: 'text-gray-900', accent: 'text-gray-600', border: 'border-gray-200', isGradient: false },
      { id: 'cream', name: '奶油风', bg: 'bg-[#fdfbf7]', text: 'text-[#4a4a4a]', accent: 'text-[#d4a373]', border: 'border-[#e6e2dd]', isGradient: false },
      { id: 'sketch', name: '手绘涂鸦', bg: 'bg-sketch-bg', text: 'text-sketch-text', accent: 'text-sketch-accent', border: 'border-sketch-border', isGradient: false },
    ]
  },
  {
    id: 'pink',
    name: '粉色系',
    icon: '🌸',
    previewBg: 'bg-pink-100',
    themes: [
      { id: 'xhs-red', name: '红书红', bg: 'bg-gradient-to-br from-red-50 to-pink-50', text: 'text-gray-900', accent: 'text-[#ff2442]', border: 'border-red-100', isGradient: false },
      { id: 'cherry', name: '樱花', bg: 'bg-gradient-to-br from-[#FFE0E6] to-[#FFFAF0]', text: 'text-[#333333]', accent: 'text-[#FF69B4]', border: 'border-pink-200', isGradient: true },
      { id: 'sunset', name: '日落', bg: '', text: 'text-white', accent: 'text-[#FF416C]', border: 'border-red-300', isGradient: true, bgStyle: { background: 'linear-gradient(45deg, #FF416C 0%, #FF4B2B 100%)' } },
    ]
  },
  {
    id: 'dark',
    name: '深色系',
    icon: '🌙',
    previewBg: 'bg-gray-900',
    themes: [
      { id: 'bento', name: '数字未来', bg: 'bg-gray-900', text: 'text-white', accent: 'text-[#00ffff]', border: 'border-gray-700', isGradient: false },
      { id: 'flowing', name: '流光', bg: '', text: 'text-white', accent: 'text-transparent bg-clip-text bg-gradient-to-r from-[#00c6ff] to-[#0072ff]', border: 'border-gray-700', isGradient: true, bgStyle: { background: 'linear-gradient(135deg, #1f1f1f 0%, #111111 100%)' } },
      { id: 'obsidian', name: '黑曜石', bg: '', text: 'text-white', accent: 'text-[#00FFFF]', border: 'border-gray-700', isGradient: true, bgStyle: { background: 'linear-gradient(135deg, #2C3E50 0%, #000000 100%)' } },
      { id: 'cyber', name: '赛博', bg: '', text: 'text-white', accent: 'text-[#FF00FF]', border: 'border-purple-700', isGradient: true, bgStyle: { background: 'linear-gradient(135deg, #3A0077 0%, #000000 100%)' } },
      { id: 'milkyway', name: '银河', bg: '', text: 'text-white', accent: 'text-[#ADD8E6]', border: 'border-purple-900', isGradient: true, bgStyle: { background: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' } },
    ]
  },
  {
    id: 'blue',
    name: '蓝绿系',
    icon: '🌊',
    previewBg: 'bg-blue-500',
    themes: [
      { id: 'deepsea', name: '深海', bg: '', text: 'text-white', accent: 'text-[#00f2f6]', border: 'border-blue-700', isGradient: true, bgStyle: { background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' } },
      { id: 'forest', name: '森林', bg: '', text: 'text-white', accent: 'text-[#2ecc71]', border: 'border-green-700', isGradient: true, bgStyle: { background: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)' } },
      { id: 'aurora', name: '极光', bg: '', text: 'text-white', accent: 'text-[#2ecc71]', border: 'border-blue-700', isGradient: true, bgStyle: { background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' } },
    ]
  },
  {
    id: 'custom',
    name: '自定义',
    icon: '🎨',
    previewBg: 'bg-gradient-to-br from-purple-400 to-pink-400',
    themes: [
      { id: 'custom', name: '自定义颜色', bg: 'bg-white', text: 'text-gray-900', accent: 'text-blue-500', border: 'border-gray-200', isGradient: false },
    ]
  }
];

export const LAYOUTS: { id: LayoutId; name: string; icon: any }[] = [
  { id: 'list', name: '干货清单', icon: AlignLeft },
  { id: 'quote', name: '金句语录', icon: Quote },
  { id: 'dict', name: '名词解释', icon: BookOpen },
  { id: 'grid', name: '知识拼图', icon: LayoutGrid },
  { id: 'sketch', name: '手绘涂鸦', icon: PenTool },
  { id: 'minimalist', name: '极简高级', icon: Feather },
];

export const RATIOS: { id: AspectRatio; name: string; value: number; label: string; icon: any }[] = [
  { id: '3:4', name: '3:4', value: 3/4, label: '封面', icon: Tablet },
  { id: '9:16', name: '9:16', value: 9/16, label: '壁纸', icon: Smartphone }
];

export const FONTS: { id: FontId; name: string }[] = [
  { id: 'font-sans-sc', name: '标准黑体' },
  { id: 'font-serif-sc', name: '优雅宋体' },
  { id: 'font-poster', name: '黄油标题' },
  { id: 'font-happy', name: '快乐萌体' },
  { id: 'font-handwriting', name: '手写书法' },
  { id: 'font-calligraphy', name: '狂草墨迹' },
  { id: 'font-artistic', name: '文艺杂志' },
];

export const FONT_SIZE_MAP: Record<FontSize, any> = {
  small: { title: 'text-3xl md:text-4xl', subtitle: 'text-sm md:text-base', content: 'text-base', quote: 'text-3xl md:text-4xl', dict: 'text-4xl md:text-5xl', gridTitle: 'text-2xl md:text-3xl', gridPoint: 'text-sm md:text-base', sketchTitle: 'text-2xl md:text-3xl', sketchContent: 'text-sm md:text-base', minimalistTitle: 'text-4xl md:text-5xl', minimalistSubtitle: 'text-base md:text-lg', minimalistContent: 'text-base' },
  normal: { title: 'text-4xl md:text-5xl', subtitle: 'text-base md:text-lg', content: 'text-lg', quote: 'text-4xl md:text-5xl', dict: 'text-5xl md:text-6xl', gridTitle: 'text-3xl md:text-4xl', gridPoint: 'text-base md:text-lg', sketchTitle: 'text-3xl md:text-4xl', sketchContent: 'text-base md:text-lg', minimalistTitle: 'text-5xl md:text-6xl', minimalistSubtitle: 'text-lg md:text-xl', minimalistContent: 'text-lg' },
  large: { title: 'text-5xl md:text-6xl', subtitle: 'text-lg md:text-xl', content: 'text-xl', quote: 'text-5xl md:text-6xl', dict: 'text-6xl md:text-7xl', gridTitle: 'text-4xl md:text-5xl', gridPoint: 'text-lg md:text-xl', sketchTitle: 'text-4xl md:text-5xl', sketchContent: 'text-lg md:text-xl', minimalistTitle: 'text-6xl md:text-7xl', minimalistSubtitle: 'text-xl md:text-2xl', minimalistContent: 'text-xl' },
};

export const PRESETS: Record<string, Preset> = {
  'tech': {
    id: 'tech',
    name: '科技',
    icon: '💻',
    data: {
      title: 'Python 学习路线图',
      subtitle: '零基础小白必看 | 建议收藏',
      content: '1. 基础语法：变量、数据类型、控制流\n2. 函数编程：作用域、Lambda、闭包\n3. 面向对象：类、继承、多态\n4. 常用模块：Pandas, NumPy, Requests',
      author: '@编程小黑',
      tag: '程序员',
      theme: 'flowing',
      font: 'font-sans-sc',
      layout: 'list',
      aspectRatio: '3:4',
      fontSize: 'normal'
    }
  },
  'travel': {
    id: 'travel',
    name: '旅行',
    icon: <Plane size={24} />,
    data: {
      title: '大理3天2夜攻略',
      subtitle: '去有风的地方，寻找自由',
      content: 'Day 1. 环洱海骑行，打卡S湾，喜洲古镇吃破酥粑粑\nDay 2. 苍山索道，寂照庵吃斋饭，感受森林氧吧\nDay 3. 沙溪古镇，体验慢生活，在古戏台发呆一下午',
      author: '@旅行日记',
      tag: '大理旅游',
      theme: 'aurora',
      font: 'font-serif-sc',
      layout: 'grid',
      aspectRatio: '3:4',
      fontSize: 'normal'
    }
  },
  'english': {
    id: 'english',
    name: '单词',
    icon: <Languages size={24} />,
    data: {
      title: 'Serendipity',
      subtitle: '[ˌserənˈdɪpəti] n. 意外发现珍奇事物的本领',
      content: 'The occurrence and development of events by chance in a happy or beneficial way.\n\n"We found this café by pure serendipity."',
      author: '@每日一词',
      tag: '英语学习',
      theme: 'minimal',
      font: 'font-serif-sc',
      layout: 'dict',
      aspectRatio: '3:4',
      fontSize: 'normal'
    }
  },
  'beauty': {
    id: 'beauty',
    name: '美妆',
    icon: '💄',
    data: {
      title: '早C晚A 其实很简单',
      subtitle: '科学护肤指南',
      content: '早C：抗氧化，防御紫外线伤害。\n晚A：抗衰老，促进胶原蛋白生成。\n\n注意事项：\n需要建立耐受，切勿贪多。',
      author: '@美妆情报局',
      tag: '护肤',
      theme: 'cherry',
      customAccentColor: '#FF69B4',
      customTextColor: '#222222',
      customBgColor: '#fef3c7',
      font: 'font-serif-sc',
      layout: 'dict',
      aspectRatio: '3:4',
      fontSize: 'normal'
    }
  },
  'movie': {
    id: 'movie',
    name: '影评',
    icon: <Clapperboard size={24} />,
    data: {
      title: 'La La Land',
      subtitle: '爱乐之城 (2016)',
      content: 'Here\'s to the ones who dream, foolish as they may seem. \n\n献给那些做梦的人，\n哪怕他们看起来傻乎乎的。',
      author: '@电影放映室',
      tag: '经典台词',
      theme: 'obsidian',
      font: 'font-artistic',
      layout: 'minimalist',
      aspectRatio: '9:16',
      fontSize: 'normal'
    }
  },
  'food': {
    id: 'food',
    name: '食谱',
    icon: <Coffee size={24} />,
    data: {
      title: '低卡减脂 早餐搭配',
      subtitle: '吃饱不胖 | 5分钟搞定',
      content: '1. 碳水：全麦面包 / 玉米 / 燕麦片\n2. 蛋白质：水煮蛋 / 无糖豆浆 / 希腊酸奶\n3. 膳食纤维：黄瓜 / 小番茄 / 蓝莓',
      author: '@减脂小厨房',
      tag: '健康饮食',
      theme: 'cream',
      font: 'font-sans-sc',
      layout: 'list',
      aspectRatio: '3:4',
      fontSize: 'normal'
    }
  },
  'sketchy': {
    id: 'sketchy',
    name: '涂鸦',
    icon: '✏️',
    data: {
      title: '我的生活碎片',
      subtitle: '一些最近发现的小确幸',
      content: '✨ 尝试了新的咖啡店，拿铁味道很棒！\n🎨 开始学习水彩画，虽然手残但很快乐。\n📚 读完一本超棒的书，推荐给你们！',
      author: '@爱画画的丸子',
      tag: '生活日记',
      theme: 'sketch',
      font: 'font-handwriting',
      layout: 'sketch',
      aspectRatio: '3:4',
      fontSize: 'normal'
    }
  },
  'minimal': {
    id: 'minimal',
    name: '极简',
    icon: '✨',
    data: {
      title: '未来生活图景',
      subtitle: '精简，高效，专注',
      content: '摒弃冗余，拥抱纯粹。在信息爆炸的时代，清晰的思路和极简的生活方式是通往高效与幸福的关键。',
      author: '@极简主义者',
      tag: '生活方式',
      theme: 'cream',
      font: 'font-serif-sc',
      layout: 'minimalist',
      aspectRatio: '9:16',
      fontSize: 'large'
    }
  }
};