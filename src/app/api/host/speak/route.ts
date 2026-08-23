import { NextResponse } from 'next/server';
import { forSpeech } from '@/lib/speakText';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

const DEFAULT_VOICE = 'cgSgspJ2msm6clMCkdW9'; // Jessica — playful, bright, warm

export async function POST(request: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'Voice is off — no ElevenLabs key.' }, { status: 503 });
  }

  let body: { text?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const locale: Locale = body.locale === 'fr' ? 'fr' : 'en';
  const text = forSpeech(typeof body.text === 'string' ? body.text : '', locale);
  if (!text) {
    return NextResponse.json({ error: 'Nothing to say.' }, { status: 400 });
  }

  const voice = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: 'POST',
    headers: {
      'xi-api-key': key,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      apply_text_normalization: 'on',
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Voice ${res.status}: ${err.slice(0, 200)}` }, { status: 502 });
  }

  const audio = await res.arrayBuffer();
  return new NextResponse(audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
      'X-Spoken-Text': encodeURIComponent(text),
    },
  });
}
