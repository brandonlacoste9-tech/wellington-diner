import { NextResponse } from 'next/server';
import { menu } from '@/content/house';
import { cleanHeard } from '@/lib/hostReply';

export const dynamic = 'force-dynamic';

function keyterms() {
  const names = new Set<string>([
    'Wellington Diner',
    'DoorDash',
    'Mac Daddy',
    'Phat Ass Burger',
    'Stoner Hash',
    'homies',
    'Eggs Benny',
    'Lobster Mac',
  ]);
  for (const section of menu) {
    for (const item of section.items) {
      const title = item.title.en.trim();
      const words = title.split(/\s+/).length;
      if (title.length > 2 && title.length < 50 && words <= 5) names.add(title);
      if (names.size >= 80) break;
    }
    if (names.size >= 80) break;
  }
  return [...names].slice(0, 80);
}

export async function POST(request: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'Voice is off — no ElevenLabs key.' }, { status: 503 });
  }

  const incoming = await request.formData();
  const raw = incoming.get('file');
  if (!(raw instanceof Blob) || raw.size < 200) {
    return NextResponse.json({ error: 'No speech caught.' }, { status: 400 });
  }

  const audio: Blob = raw;
  const apiKey: string = key;
  const locale = incoming.get('locale') === 'fr' ? 'fra' : 'eng';
  const filename = audio.type.includes('mp4') ? 'talk.mp4' : 'talk.webm';
  const upload = new File([audio], filename, { type: audio.type || 'audio/webm' });

  async function transcribe(model: string, terms: string[]) {
    const outbound = new FormData();
    outbound.append('model_id', model);
    outbound.append('language_code', locale);
    outbound.append('tag_audio_events', 'false');
    outbound.append('diarize', 'false');
    outbound.append('file', upload);
    for (const term of terms) outbound.append('keyterms', term);
    return fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: { 'xi-api-key': apiKey },
      body: outbound,
    });
  }

  let res = await transcribe('scribe_v2', keyterms());
  if (!res.ok) res = await transcribe('scribe_v2', []);
  if (!res.ok) res = await transcribe('scribe_v1', []);

  const data = (await res.json()) as { text?: string };
  if (!res.ok) {
    return NextResponse.json({ error: `Listen ${res.status}` }, { status: 502 });
  }

  const rawText = (data.text || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const text = cleanHeard(rawText);

  if (!text) {
    return NextResponse.json({ error: 'Didn’t catch that.' }, { status: 422 });
  }

  return NextResponse.json({ text });
}
