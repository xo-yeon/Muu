import { describe, expect, it, vi } from 'vitest';
import { emotionTags, questions } from '@/data/questions';
import type { MuuSubmission } from '@/types/muu';
import { analyzeHumanState } from './analysis';
import {
  buildObservationContext,
  buildOpenAiRequestBody,
  generateLocalObservation,
  extractResponseText,
  generateOpenAiObservation,
  OpenAiObservationError,
  parseObservationResponse
} from './openaiObservation';

const submission: MuuSubmission = {
  answers: questions.slice(0, 12).map((question) => ({
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
    expect(JSON.stringify(body.input)).toContain('Do not change or dispute it');
  });

  it('includes selected answers, emotion tags, free text, and fixed result in the AI context', () => {
    const result = analyzeHumanState(submission);
    const context = buildObservationContext({ submission, result });

    expect(context.freeText).toBe(submission.freeText);
    expect(context.selectedAnswers).toHaveLength(submission.answers.length);
    expect(context.selectedAnswers[0]).toMatchObject({
      questionId: questions[0].id,
      questionText: questions[0].text,
      optionId: questions[0].options[0].id,
      optionLabel: questions[0].options[0].label
    });
    expect(context.selectedEmotionTags[0]).toEqual({
      id: 'anxious',
      label: emotionTags.find((tag) => tag.id === 'anxious')?.label
    });
    expect(context.fixedResult.id).toBe(result.id);
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

  it('parses observation JSON even when text is wrapped', () => {
    expect(parseObservationResponse('```json\n{"observation":"오늘은 생각이 일을 대신하고 있습니다."}\n```')).toEqual({
      observation: '오늘은 생각이 일을 대신하고 있습니다.'
    });
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

  it('does not call OpenAI when free text is empty', async () => {
    const submissionWithoutFreeText = { ...submission, freeText: '' };
    const result = analyzeHumanState(submissionWithoutFreeText);
    const fetcher = vi.fn(async () => {
      return new Response(JSON.stringify({ output_text: '{"observation":"선택값만 봐도 오늘은 생각 과열 쪽으로 기울어 있습니다."}' }), {
        status: 200
      });
    });

    await expect(
      generateOpenAiObservation({ submission: submissionWithoutFreeText, result }, { apiKey: 'test-key', fetcher })
    ).resolves.toBeUndefined();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('generates a deterministic local observation from free text and fixed result', () => {
    const result = analyzeHumanState(submission);

    expect(generateLocalObservation({ submission, result })).toBe(generateLocalObservation({ submission, result }));
    expect(generateLocalObservation({ submission: { ...submission, freeText: '' }, result })).toBeUndefined();
  });

  it('preserves OpenAI error status for debugging', async () => {
    const result = analyzeHumanState(submission);
    const fetcher = vi.fn(async () => {
      return new Response('quota exceeded', { status: 429 });
    });

    await expect(generateOpenAiObservation({ submission, result }, { apiKey: 'test-key', fetcher })).rejects.toMatchObject({
      name: 'OpenAiObservationError',
      status: 429
    } satisfies Partial<OpenAiObservationError>);
  });

  it('uses a Responses-compatible default model', async () => {
    const result = analyzeHumanState(submission);
    const fetcher = vi.fn(async () => {
      return new Response(JSON.stringify({ output_text: '{"observation":"메모를 보면 문제는 의지보다 실행 슬롯 부족입니다."}' }), {
        status: 200
      });
    });

    await generateOpenAiObservation({ submission, result }, { apiKey: 'test-key', fetcher });

    const request = fetcher.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(request.body))).toMatchObject({ model: 'gpt-4.1-mini' });
  });
});
