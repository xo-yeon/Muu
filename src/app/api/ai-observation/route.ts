import { NextResponse } from 'next/server';
import { analyzeHumanState } from '@/lib/analysis';
import { generateLocalObservation, generateOpenAiObservation, OpenAiObservationError } from '@/lib/openaiObservation';
import type { MuuSubmission } from '@/types/muu';

export async function POST(request: Request) {
  const submission = (await request.json()) as MuuSubmission;
  const result = analyzeHumanState(submission);

  if (!submission.freeText.trim()) {
    return NextResponse.json({ aiObservation: null });
  }

  const localObservation = generateLocalObservation({ submission, result });

  if (process.env.OPENAI_OBSERVATION_MODE !== 'api') {
    return NextResponse.json({ aiObservation: localObservation ?? null, source: 'local' });
  }

  try {
    const aiObservation = await generateOpenAiObservation({ submission, result });

    return NextResponse.json({ aiObservation: aiObservation ?? localObservation ?? null, source: 'openai' });
  } catch (error) {
    const debugError = getDebugError(error);
    console.error('[Muu AI observation failed]', debugError ?? error);

    return NextResponse.json(
      {
        aiObservation: localObservation ?? null,
        source: 'local',
        ...(process.env.NODE_ENV !== 'production' && debugError ? { debugError } : {})
      },
      { status: 200 }
    );
  }
}

function getDebugError(error: unknown) {
  if (error instanceof OpenAiObservationError) {
    return {
      message: error.message,
      status: error.status ?? null
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: null
    };
  }

  return null;
}
