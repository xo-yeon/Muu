import { describe, expect, it } from 'vitest';
import type { HumanTypeId } from '@/types/muu';

describe('characterAssets', () => {
  it('returns the character image path for a human type', async () => {
    const { getCharacterAssetPath } = await import('./characterAssets');

    expect(getCharacterAssetPath('quietBurnout')).toBe('/assets/characters/quietBurnout.png');
  });

  it('has an asset path for every human type id', async () => {
    const { characterAssetPaths } = await import('./characterAssets');
    const humanTypeIds: HumanTypeId[] = [
      'overheatedPlanner',
      'quietBurnout',
      'futureBuffering',
      'survivalMode',
      'dopamineScroller',
      'unexpectedlyOkay',
      'emotionalWave',
      'softSystemOverload',
      'excuseBlacksmith',
      'procrastinationSlime',
      'anxietyWizard',
      'dopamineGoblin',
      'planningMaxNewbie',
      'emotionTank',
      'realityEscapeAssassin',
      'rationalizationAlchemist',
      'blameSummoner',
      'paperArmorMental'
    ];

    expect(Object.keys(characterAssetPaths).sort()).toEqual([...humanTypeIds].sort());
  });
});
