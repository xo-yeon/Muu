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

export async function generateOpenAiObservation(
  input: OpenAiObservationInput,
  options: OpenAiObservationOptions = {}
): Promise<string | undefined> {
  if (!input.submission.freeText.trim()) {
    return undefined;
  }

  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
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
    throw new Error(`OpenAI request failed: ${response.status} ${message.slice(0, 300)}`);
  }

  const data: unknown = await response.json();
  const outputText = extractResponseText(data);
  const parsed = parseObservationResponse(outputText);
  const observation = parsed.observation?.trim();

  if (!observation) {
    throw new Error('OpenAI response did not include observation.');
  }

  return observation.slice(0, 260);
}

export function buildOpenAiRequestBody(input: OpenAiObservationInput, model: string) {
  return {
    model,
    input: [
      {
        role: 'developer',
        content: [
          '너는 Muu 앱의 보조 관찰자다.',
          '인간 유형은 이미 룰 기반 분석으로 확정되었으므로 절대 바꾸지 않는다.',
          '의학적 진단, 치료 조언, 과한 위로, 사용자 비난은 금지한다.',
          '한국어로 1~2문장만 쓴다.',
          '귀여운 UI와 대비되게 현실적이고 직설적인 톤을 유지한다.',
          '반드시 JSON 객체만 반환한다. 형식: {"observation":"..."}'
        ].join('\n')
      },
      {
        role: 'user',
        content: JSON.stringify({
          freeText: input.submission.freeText,
          emotionTagIds: input.submission.emotionTagIds,
          fixedResult: {
            id: input.result.id,
            typeName: input.result.typeName,
            statusSummary: input.result.statusSummary,
            emotionWeather: input.result.emotionWeather,
            factLine: input.result.factLine,
            action: input.result.action,
            dominantAxes: input.result.dominantAxes
          }
        })
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
