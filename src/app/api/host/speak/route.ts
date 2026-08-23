import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_VOICE = 'cgSgspJ2msm6clMCkdW9'; // Jessica — playful, bright, warm

function forSpeech(text: string) {
  return text
    .replace(/https?:\/\/\S+/gi, 'the link on the screen')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 900);
}

export async function POST(request: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'Voice is off — no ElevenLabs key.' }, { status: 503 });
  }

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const text = forSpeech(typeof body.text === 'string' ? body.text : '');
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
      model_id: 'eleven_flash_v2_5',
      voice_settings: {
        stability: 0.42,
        similarity_boost: 0.78,
        style: 0.45,
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
    },
  });
}
