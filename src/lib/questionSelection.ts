import type { Question } from '@/types/muu';

export const questionSessionSize = 10;

export function selectRandomQuestions(
  source: Question[],
  count = questionSessionSize,
  random: () => number = Math.random
): Question[] {
  const shuffled = [...source];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
