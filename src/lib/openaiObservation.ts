import { emotionTags, questions } from '@/data/questions';
import type { HumanResult, MuuSubmission } from '@/types/muu';

const openaiResponsesUrl = 'https://api.openai.com/v1/responses';
const defaultModel = 'gpt-4.1-mini';

type OpenAiObservationInput = {
  submission: MuuSubmission;
  result: HumanResult;
};

type OpenAiObservationOptions = {
  apiKey?: string;
  model?: string;
  fetcher?: typeof fetch;
};

type OpenAiObservationResponse = {
  observation: string;
};

const localToneByAxis: Partial<Record<HumanResult['dominantAxes'][number], string>> = {
  overthinking: '생각이 너무 앞서가서 실제 행동 칸이 조금 비어 있습니다',
  avoidance: '피하고 싶은 마음이 꽤 선명하지만, 문제 자체가 사라진 건 아닙니다',
  burnout: '에너지 잔량이 낮아서 의지보다 소모 관리가 먼저입니다',
  anxiety: '걱정이 준비처럼 보이지만, 오늘은 확인 가능한 것만 남기는 편이 낫습니다',
  execution: '할 일 쪽으로 몸은 움직이고 있지만, 회복 슬롯도 같이 필요합니다',
  socialFatigue: '사람 관련 배터리가 줄어든 상태라 반응을 줄이는 게 효율적입니다',
  emotionalSensitivity: '작은 자극도 크게 들어오는 날이라 결정을 서두르면 손해입니다',
  stability: '생각보다 중심은 잡혀 있으니 일을 더 키우지 않는 쪽이 유리합니다',
  dopamineSeeking: '즉시 보상 쪽으로 손이 가기 쉬워서 시작 전에 화면부터 줄여야 합니다'
};

export class OpenAiObservationError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'OpenAiObservationError';
    this.status = status;
  }
}

export async function generateOpenAiObservation(
  input: OpenAiObservationInput,
  options: OpenAiObservationOptions = {}
): Promise<string | undefined> {
  if (!input.submission.freeText.trim()) {
    return undefined;
  }

  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new OpenAiObservationError('OPENAI_API_KEY is not configured.');
  }

  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(openaiResponsesUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildOpenAiRequestBody(input, options.model ?? process.env.OPENAI_MODEL ?? defaultModel))
  });

  if (!response.ok) {
    const message = await response.text();
    throw new OpenAiObservationError(`OpenAI request failed: ${response.status} ${message.slice(0, 300)}`, response.status);
  }

  const data: unknown = await response.json();
  const outputText = extractResponseText(data);
  const parsed = parseObservationResponse(outputText);
  const observation = parsed.observation?.trim();

  if (!observation) {
    throw new OpenAiObservationError('OpenAI response did not include observation.');
  }

  return observation.slice(0, 260);
}

export function generateLocalObservation(input: OpenAiObservationInput): string | undefined {
  const freeText = input.submission.freeText.trim();

  if (!freeText) {
    return undefined;
  }

  const primaryAxis = input.result.dominantAxes[0];
  const tone = localToneByAxis[primaryAxis] ?? '오늘 상태는 이미 결과에 충분히 드러나 있습니다';
  const memoHint = freeText.length >= 32 ? '메모가 길어진 만큼 머릿속 정리 비용도 같이 올라간 상태입니다' : '메모는 짧지만 방향은 충분히 보입니다';

  return `${memoHint}. ${tone}.`;
}

export function buildOpenAiRequestBody(input: OpenAiObservationInput, model: string) {
  return {
    model,
    input: [
      {
        role: 'developer',
        content: [
          'You are the assistant observer for Muu.',
          'The human type is already fixed by deterministic rule-based analysis. Do not change or dispute it.',
          'Use all user signals together: selected question answers, selected emotion tags, free text, and the fixed result.',
          'Do not use medical diagnosis, therapy advice, excessive comfort, or blame.',
          'Write in Korean, in 1-2 realistic and slightly direct sentences that fit a cute pixel game UI.',
          'Return only a JSON object. Shape: {"observation":"..."}'
        ].join('\n')
      },
      {
        role: 'user',
        content: JSON.stringify(buildObservationContext(input))
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'muu_ai_observation',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            observation: {
              type: 'string',
              minLength: 12,
              maxLength: 260
            }
          },
          required: ['observation']
        },
        strict: true
      }
    },
    max_output_tokens: 220
  };
}

export function buildObservationContext(input: OpenAiObservationInput) {
  return {
    freeText: input.submission.freeText.trim(),
    selectedAnswers: input.submission.answers.map((answer) => {
      const question = questions.find((item) => item.id === answer.questionId);
      const option = question?.options.find((item) => item.id === answer.optionId);

      return {
        questionId: answer.questionId,
        questionText: question?.text ?? null,
        optionId: answer.optionId,
        optionLabel: option?.label ?? null
      };
    }),
    selectedEmotionTags: input.submission.emotionTagIds.map((tagId) => {
      const tag = emotionTags.find((item) => item.id === tagId);

      return {
        id: tagId,
        label: tag?.label ?? null
      };
    }),
    fixedResult: {
      id: input.result.id,
      typeName: input.result.typeName,
      statusSummary: input.result.statusSummary,
      emotionWeather: input.result.emotionWeather,
      factLine: input.result.factLine,
      action: input.result.action,
      forbiddenAction: input.result.forbiddenAction,
      dominantAxes: input.result.dominantAxes,
      scores: input.result.scores
    }
  };
}

export function extractResponseText(data: unknown): string {
  if (isRecord(data) && typeof data.output_text === 'string') {
    return data.output_text;
  }

  if (isRecord(data) && Array.isArray(data.output)) {
    for (const item of data.output) {
      if (!isRecord(item) || !Array.isArray(item.content)) {
        continue;
      }

      for (const content of item.content) {
        if (isRecord(content) && typeof content.text === 'string') {
          return content.text;
        }
      }
    }
  }

  throw new Error('OpenAI response text was not found.');
}

export function parseObservationResponse(outputText: string): Partial<OpenAiObservationResponse> {
  try {
    return JSON.parse(outputText) as Partial<OpenAiObservationResponse>;
  } catch {
    const jsonMatch = outputText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('OpenAI response was not valid JSON.');
    }

    return JSON.parse(jsonMatch[0]) as Partial<OpenAiObservationResponse>;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
