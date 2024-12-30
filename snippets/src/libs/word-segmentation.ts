
import wordcut from 'wordcut';

// Note that wordcut only work on Node.js environment
wordcut.init();
/**
 * Segment Thai words in the input string as space-separated words
 * The output make sure space between words and double spaces for original spaces
 *
 * @param input 
 * @returns 
 */
export function thaiWordSegmentation(input: string): string {
  return wordcut.cut(input)
}
