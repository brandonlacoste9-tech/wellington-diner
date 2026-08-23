import { NextResponse } from 'next/server';
import { cleanHeard, foodCue, hostSystemPrompt, localHostReply, type HostMessage } from '@/lib/hostReply';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

const MODEL = 'grok-4.5';

function asLocale(value: unknown): Locale {
  return value === 'fr' ? 'fr' : 'en';
}

async function grokReply(messages: HostMessage[], locale: Locale) {
  const key = process.env.XAI_API_KEY;
  if (!key) return null;

  const recent = messages.slice(-8);
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 420,
      messages: [{ role: 'system', content: hostSystemPrompt(locale) }, ...recent],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`host model ${res.status}: ${err.slice(0, 240)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || null;
}

export async function POST(request: Request) {
  let body: { locale?: string; messages?: HostMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const locale = asLocale(body.locale);
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const lastRaw = [...messages].reverse().find((msg) => msg.role === 'user')?.content?.trim() || '';
  const last = cleanHeard(lastRaw);
  const fallback = localHostReply(last, locale);
  if (foodCue(last) || !last) {
    return NextResponse.json({ text: fallback, source: 'board' });
  }

  const cleaned = messages.map((msg) =>
    msg.role === 'user' ? { ...msg, content: cleanHeard(msg.content) } : msg,
  );

  try {
    const text = await grokReply(cleaned, locale);
    if (text) {
      return NextResponse.json({ text, source: 'host' });
    }
  } catch {
    return NextResponse.json({ text: fallback, source: 'board' });
  }

  return NextResponse.json({ text: fallback, source: 'board' });
}
