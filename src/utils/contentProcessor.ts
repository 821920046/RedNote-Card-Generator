/**
 * Content Processing Utilities for RedNote Card Generator
 * - Auto-pagination based on aspect ratio character limits
 * - Smart emoji insertion
 */

import { AspectRatio } from '../types';

// Character limits per page based on aspect ratio
// These are approximate values that work well with typical font sizes
export const CHAR_LIMITS: Record<AspectRatio, number> = {
    '3:4': 150,   // 3:4 ratio has less vertical space
    '9:16': 250,  // 9:16 ratio (portrait) has more vertical space
};

// Common emojis categorized by context
const EMOJI_SETS = {
    list: ['✨', '🌟', '💡', '📌', '🎯', '✅', '💫', '⭐', '🔥', '💪'],
    positive: ['😊', '🥰', '💕', '🌸', '🌈', '🍀', '🎉', '💖', '✨', '🌺'],
    food: ['🍜', '🍕', '☕', '🍰', '🍵', '🥗', '🍿', '🧁', '🍪', '🍩'],
    travel: ['✈️', '🌍', '🏝️', '🗺️', '🚀', '🌄', '🏔️', '🌅', '⛱️', '🎒'],
    work: ['💼', '📊', '💻', '📝', '🎯', '📈', '🔍', '📚', '✏️', '🗂️'],
    creative: ['🎨', '🖌️', '📷', '🎬', '🎸', '🎤', '🖼️', '✍️', '🎭', '🎹'],
    nature: ['🌿', '🌻', '🍃', '🌳', '🌊', '☀️', '🌙', '⭐', '🦋', '🌷'],
    default: ['✨', '💡', '📌', '🌟', '💫', '🎯', '💪', '🔥', '⭐', '🌈'],
};

/**
 * Get a random emoji from a set
 */
function getRandomEmoji(set: string[] = EMOJI_SETS.default): string {
    return set[Math.floor(Math.random() * set.length)];
}

/**
 * Detect content theme and return appropriate emoji set
 */
function detectEmojiSet(content: string): string[] {
    const lowerContent = content.toLowerCase();

    if (/食|吃|餐|咖啡|奶茶|蛋糕|面|饭|菜/.test(content)) return EMOJI_SETS.food;
    if (/旅|游|飞|机场|酒店|景|海|山/.test(content)) return EMOJI_SETS.travel;
    if (/工作|开会|项目|任务|计划|目标/.test(content)) return EMOJI_SETS.work;
    if (/画|设计|创作|摄影|音乐|艺术/.test(content)) return EMOJI_SETS.creative;
    if (/花|草|树|自然|公园|天气/.test(content)) return EMOJI_SETS.nature;
    if (/开心|快乐|幸福|爱|美好|可爱/.test(content)) return EMOJI_SETS.positive;

    return EMOJI_SETS.default;
}

/**
 * Insert emojis at appropriate positions in content
 * - At the start of list items (if not already present)
 * - At the start of paragraphs (randomly, ~30% chance)
 */
export function insertEmojis(content: string): string {
    const emojiSet = detectEmojiSet(content);
    const lines = content.split('\n');

    const processedLines = lines.map((line, index) => {
        const trimmedLine = line.trim();

        // Skip empty lines
        if (!trimmedLine) return line;

        // Skip if line already starts with an emoji
        const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
        if (emojiRegex.test(trimmedLine)) return line;

        // Skip markdown headers
        if (trimmedLine.startsWith('#')) return line;

        // List items: always add emoji
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || /^\d+\./.test(trimmedLine)) {
            const emoji = getRandomEmoji(emojiSet);
            // Insert emoji after the list marker
            return line.replace(/^(\s*[-*]|\d+\.)\s*/, `$1 ${emoji} `);
        }

        // Regular paragraphs: 30% chance to add emoji at start
        if (index === 0 || (trimmedLine.length > 10 && Math.random() < 0.3)) {
            const emoji = getRandomEmoji(emojiSet);
            const leadingSpaces = line.match(/^\s*/)?.[0] || '';
            return `${leadingSpaces}${emoji} ${trimmedLine}`;
        }

        return line;
    });

    return processedLines.join('\n');
}

/**
 * Split content into pages based on character limit
 * Tries to split at natural breakpoints (newlines, sentences)
 */
export function paginateContent(content: string, aspectRatio: AspectRatio): string[] {
    const charLimit = CHAR_LIMITS[aspectRatio] || CHAR_LIMITS['3:4'];

    // If content is short enough, return as single page
    if (content.length <= charLimit) {
        return [content];
    }

    const pages: string[] = [];
    let remainingContent = content;

    while (remainingContent.length > 0) {
        if (remainingContent.length <= charLimit) {
            pages.push(remainingContent.trim());
            break;
        }

        // Find the best split point within the limit
        let splitIndex = charLimit;

        // Try to split at a paragraph break (double newline)
        const paragraphBreak = remainingContent.lastIndexOf('\n\n', charLimit);
        if (paragraphBreak > charLimit * 0.5) {
            splitIndex = paragraphBreak;
        } else {
            // Try to split at a single newline
            const lineBreak = remainingContent.lastIndexOf('\n', charLimit);
            if (lineBreak > charLimit * 0.5) {
                splitIndex = lineBreak;
            } else {
                // Try to split at sentence end (。！？)
                const sentenceEnd = Math.max(
                    remainingContent.lastIndexOf('。', charLimit),
                    remainingContent.lastIndexOf('！', charLimit),
                    remainingContent.lastIndexOf('？', charLimit),
                    remainingContent.lastIndexOf('.', charLimit),
                    remainingContent.lastIndexOf('!', charLimit),
                    remainingContent.lastIndexOf('?', charLimit)
                );
                if (sentenceEnd > charLimit * 0.3) {
                    splitIndex = sentenceEnd + 1;
                }
            }
        }

        // Extract the page content
        const pageContent = remainingContent.substring(0, splitIndex).trim();
        if (pageContent) {
            pages.push(pageContent);
        }

        // Continue with remaining content
        remainingContent = remainingContent.substring(splitIndex).trim();
    }

    return pages;
}

/**
 * Process content: insert emojis and auto-paginate
 * Returns content with page separators (===)
 */
export function processContent(content: string, aspectRatio: AspectRatio, addEmojis: boolean = true): string {
    // Step 1: Insert emojis if enabled
    let processedContent = addEmojis ? insertEmojis(content) : content;

    // Step 2: Paginate based on aspect ratio
    const pages = paginateContent(processedContent, aspectRatio);

    // Step 3: Join with separator
    return pages.join('\n\n===\n\n');
}
