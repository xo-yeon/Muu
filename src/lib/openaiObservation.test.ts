import { describe, expect, it, vi } from 'vitest';
import { analyzeHumanState } from './analysis';
import { buildOpenAiRequestBody, extractResponseText, generateOpenAiObservation } from './openaiObservation';
import { questions } from '@/data/questions';
import type { MuuSubmission } from '@/types/muu';

const submission: MuuSubmission = {
  answers: questions.map((question) => ({
    questionId: question.id,
    optionId: question.options[0].id
  })),
  emotionTagIds: ['anxious'],
  freeText: '할 일은 많은데 계획만 세우고 계속 미루는 중'
};

describe('openaiObservation', () => {
  it('builds a structured Responses API request without changing the fixed result', () => {
    const result = analyzeHumanState(submission);
    const body = buildOpenAiRequestBody({ submission, result }, 'gpt-test');

    expect(body.model).toBe('gpt-test');
    expect(body.text.format.type).toBe('json_schema');
    expect(JSON.stringify(body.input)).toContain(result.typeName);
    expect(JSON.stringify(body.input)).toContain('절대 바꾸지 않는다');
  });

  it('extracts output text from Responses API shape', () => {
    expect(
      extractResponseText({
        output: [
          {
            content: [{ type: 'output_text', text: '{"observation":"오늘은 생각이 일을 대신하고 있습니다."}' }]
          }
        ]
      })
    ).toBe('{"observation":"오늘은 생각이 일을 대신하고 있습니다."}');
  });

  it('calls OpenAI and returns parsed observation', async () => {
    const result = analyzeHumanState(submission);
    const fetcher = vi.fn(async () => {
      return new Response(JSON.stringify({ output_text: '{"observation":"계획은 충분합니다. 오늘은 하나만 실제로 끝내세요."}' }), {
        status: 200
      });
    });

    await expect(generateOpenAiObservation({ submission, result }, { apiKey: 'test-key', fetcher })).resolves.toBe(
      '계획은 충분합니다. 오늘은 하나만 실제로 끝내세요.'
    );
    expect(fetcher).toHaveBeenCalledWith('https://api.openai.com/v1/responses', expect.any(Object));
  });
});
