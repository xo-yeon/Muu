import type { HumanTypeId } from '@/types/muu';

export const characterAssetPaths: Record<HumanTypeId, string> = {
  overheatedPlanner: '/assets/characters/overheatedPlanner.png',
  quietBurnout: '/assets/characters/quietBurnout.png',
  futureBuffering: '/assets/characters/futureBuffering.png',
  survivalMode: '/assets/characters/survivalMode.png',
  dopamineScroller: '/assets/characters/dopamineScroller.png',
  unexpectedlyOkay: '/assets/characters/unexpectedlyOkay.png',
  emotionalWave: '/assets/characters/emotionalWave.png',
  softSystemOverload: '/assets/characters/softSystemOverload.png',
  excuseBlacksmith: '/assets/characters/excuseBlacksmith.png',
  procrastinationSlime: '/assets/characters/procrastinationSlime.png',
  anxietyWizard: '/assets/characters/anxietyWizard.png',
  dopamineGoblin: '/assets/characters/dopamineGoblin.png',
  planningMaxNewbie: '/assets/characters/planningMaxNewbie.png',
  emotionTank: '/assets/characters/emotionTank.png',
  realityEscapeAssassin: '/assets/characters/realityEscapeAssassin.png',
  rationalizationAlchemist: '/assets/characters/rationalizationAlchemist.png',
  blameSummoner: '/assets/characters/blameSummoner.png',
  paperArmorMental: '/assets/characters/paperArmorMental.png'
};

export function getCharacterAssetPath(typeId: HumanTypeId): string {
  return characterAssetPaths[typeId];
}
