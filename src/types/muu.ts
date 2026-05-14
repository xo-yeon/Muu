export type Axis =
  | 'overthinking'
  | 'avoidance'
  | 'burnout'
  | 'anxiety'
  | 'execution'
  | 'socialFatigue'
  | 'emotionalSensitivity'
  | 'stability'
  | 'dopamineSeeking';

export type AxisScores = Record<Axis, number>;

export type QuestionOption = {
  id: string;
  label: string;
  scores: Partial<AxisScores>;
};

export type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
};

export type EmotionTag = {
  id: string;
  label: string;
  scores: Partial<AxisScores>;
};

export type MuuAnswer = {
  questionId: string;
  optionId: string;
};

export type HumanTypeId =
  | 'overheatedPlanner'
  | 'quietBurnout'
  | 'futureBuffering'
  | 'survivalMode'
  | 'dopamineScroller'
  | 'unexpectedlyOkay'
  | 'emotionalWave'
  | 'softSystemOverload'
  | 'excuseBlacksmith'
  | 'procrastinationSlime'
  | 'anxietyWizard'
  | 'dopamineGoblin'
  | 'planningMaxNewbie'
  | 'emotionTank'
  | 'realityEscapeAssassin'
  | 'rationalizationAlchemist'
  | 'blameSummoner'
  | 'paperArmorMental';

export type RewardItem = {
  name: string;
  description: string;
  assetPath?: string;
};

export type ResultComparison = {
  label: string;
  summary: string;
};

export type HumanResult = {
  id: HumanTypeId;
  typeName: string;
  statusSummary: string[];
  emotionWeather: string;
  factLine: string;
  action: string;
  forbiddenAction: string;
  rewardItem: RewardItem;
  comparison?: ResultComparison;
  character: {
    name: string;
    body: string;
    mood: string;
  };
  scores: AxisScores;
  dominantAxes: Axis[];
  aiObservation?: string;
};

export type MuuSubmission = {
  answers: MuuAnswer[];
  emotionTagIds: string[];
  freeText: string;
};

export type StoredMuuResult = {
  savedAt: string;
  submission: MuuSubmission;
  result: HumanResult;
};
