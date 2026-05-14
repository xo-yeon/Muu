import { NextResponse } from 'next/server';
import { analyzeHumanState } from '@/lib/analysis';
import { generateOpenAiObservation } from '@/lib/openaiObservation';
import type { MuuSubmission } from '@/types/muu';

export async function POST(request: Request) {
  const submission = (await request.json()) as MuuSubmission;
  const result = analyzeHumanState(submission);

  if (!submission.freeText.trim()) {
    return NextResponse.json({ aiObservation: null });
  }

  try {
    const aiObservation = await generateOpenAiObservation({ submission, result });

    return NextResponse.json({ aiObservation });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        aiObservation: null,
        error: 'AI 관찰 생성에 실패했습니다. 룰 기반 결과만 표시합니다.'
      },
      { status: 200 }
    );
  }
}
