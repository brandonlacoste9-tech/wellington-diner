'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { house } from '@/content/house';
import type { Locale } from '@/i18n/routing';
import type { HostMessage } from '@/lib/hostReply';

const chips = [
  { id: 'hours', prompt: { en: 'What are your hours?', fr: 'Quelles sont vos heures ?' } },
  { id: 'book', prompt: { en: 'I want to book a table', fr: 'Je veux réserver une table' } },
  { id: 'mac', prompt: { en: 'Tell me about the Mac Daddy', fr: 'Parle-moi du Mac Daddy' } },
  { id: 'kids', prompt: { en: 'Kids eat free?', fr: 'Enfants mangent gratis ?' } },
  { id: 'dash', prompt: { en: 'Do you do DoorDash?', fr: 'Vous êtes sur DoorDash ?' } },
  { id: 'burgers', prompt: { en: 'What burgers do you have?', fr: 'Quels burgers avez-vous ?' } },
  { id: 'poutine', prompt: { en: 'What poutines are on the board?', fr: 'Quelles poutines avez-vous ?' } },
] as const;

type Bubble = HostMessage & { id: string };
type MicState = 'idle' | 'recording' | 'transcribing';

function HostFace() {
  return (
    <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-cream bg-red text-cream" aria-hidden="true">
      <span className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,#fff7ea_0_6px,#c4122e_6px_12px)]" />
      <span className="font-heading text-lg font-extrabold leading-none">Hi</span>
    </span>
  );
}

function pickMime() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  return types.find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || '';
}

export function BoothHost() {
  const t = useTranslations('host');
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Bubble[]>([
    { id: 'hello', role: 'assistant', content: t('hello') },
  ]);
  const [muted, setMuted] = useState(false);
  const [mic, setMic] = useState<MicState>('idle');
  const [micNote, setMicNote] = useState('');
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrl = useRef<string | null>(null);
  const messagesRef = useRef(messages);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const stopTimer = useRef<number | null>(null);
  messagesRef.current = messages;

  function stopVoice() {
    audioRef.current?.pause();
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (stopTimer.current) {
      window.clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
  }

  async function speak(text: string) {
    if (muted || !text) return;
    try {
      const res = await fetch('/api/host/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, locale }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      stopVoice();
      const url = URL.createObjectURL(blob);
      objectUrl.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      await audio.play();
    } catch {
      // Text still shows if voice is down.
    }
  }

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open && !muted) {
      void speak(t('hello'));
    }
    if (!open) {
      stopVoice();
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      stopStream();
      setMic('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (muted) stopVoice();
  }, [muted]);

  useEffect(() => {
    return () => {
      stopVoice();
      stopStream();
    };
  }, []);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const user: Bubble = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    const next = [...messagesRef.current, user];
    setMessages(next);
    messagesRef.current = next;
    setInput('');
    setPending(true);
    try {
      const res = await fetch('/api/host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json()) as { text?: string };
      const reply = data.text || t('fallback');
      setMessages((cur) => [...cur, { id: crypto.randomUUID(), role: 'assistant', content: reply }]);
      void speak(reply);
    } catch {
      setMessages((cur) => [...cur, { id: crypto.randomUUID(), role: 'assistant', content: t('fallback') }]);
    } finally {
      setPending(false);
    }
  }

  async function finishRecording(blob: Blob) {
    setMic('transcribing');
    setMicNote(t('transcribing'));
    try {
      const body = new FormData();
      body.append('file', blob, blob.type.includes('mp4') ? 'talk.mp4' : 'talk.webm');
      body.append('locale', locale);
      const res = await fetch('/api/host/listen', { method: 'POST', body });
      const data = (await res.json()) as { text?: string };
      const heard = data.text?.trim();
      if (!res.ok || !heard) {
        setMicNote(t('micEmpty'));
        return;
      }
      setInput(heard);
      setMicNote('');
      await ask(heard);
    } catch {
      setMicNote(t('micEmpty'));
    } finally {
      setMic('idle');
    }
  }

  async function toggleMic() {
    if (pending || mic === 'transcribing') return;
    if (mic === 'recording') {
      recorderRef.current?.stop();
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setMicNote(t('micUnsupported'));
      return;
    }
    setMicNote('');
    stopVoice();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMime();
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        stopStream();
        recorderRef.current = null;
        void finishRecording(blob);
      };
      recorder.start();
      setMic('recording');
      setMicNote(t('listening'));
      stopTimer.current = window.setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop();
      }, 15000);
    } catch {
      setMicNote(t('micError'));
      stopStream();
      setMic('idle');
    }
  }

  return (
    <div className="pointer-events-none fixed right-4 z-50 bottom-[5.5rem] md:bottom-[5.75rem]">
      {open ? (
        <div
          className="pointer-events-auto mb-3 flex h-[min(32rem,70dvh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden border-4 border-ink bg-cream text-ink shadow-[8px_8px_0_#1c1c1c]"
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
        >
          <div className="awning" />
          <div className="flex items-center gap-3 bg-chrome px-3 py-2 text-white">
            <HostFace />
            <div className="min-w-0 flex-1">
              <p className="font-heading text-xl font-extrabold leading-none">{t('title')}</p>
              <p className="truncate text-[0.7rem] text-white/70">{t('subtitle')}</p>
            </div>
            <button
              type="button"
              className="h-10 px-2 text-xs font-extrabold uppercase"
              onClick={() => setMuted((value) => !value)}
            >
              {muted ? t('unmute') : t('mute')}
            </button>
            <button type="button" className="h-10 px-2 text-xs font-extrabold uppercase" onClick={() => setOpen(false)}>
              {t('close')}
            </button>
          </div>
          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((msg) => (
              <p
                key={msg.id}
                className={
                  msg.role === 'user'
                    ? 'ml-8 border-2 border-red bg-red px-3 py-2 text-sm text-white'
                    : 'mr-8 border-2 border-ink bg-paper px-3 py-2 text-sm'
                }
              >
                {msg.content}
              </p>
            ))}
            {pending ? <p className="text-xs font-extrabold tracking-[0.16em] text-muted uppercase">{t('thinking')}</p> : null}
          </div>
          <div className="flex flex-wrap gap-1 border-t-2 border-ink px-3 py-2">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className="border border-ink px-2 py-1 text-[0.65rem] font-extrabold tracking-[0.08em] uppercase"
                onClick={() => ask(chip.prompt[locale])}
              >
                {t(`chip.${chip.id}`)}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2 border-t-2 border-ink p-2"
            onSubmit={(event) => {
              event.preventDefault();
              void ask(input);
            }}
          >
            <label className="sr-only" htmlFor="booth-host-input">
              {t('placeholder')}
            </label>
            <input
              id="booth-host-input"
              ref={field}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={mic === 'recording' ? t('listening') : t('placeholder')}
              className="min-w-0 flex-1 border-2 border-ink bg-white px-3 py-2 text-sm outline-none"
              maxLength={500}
              autoComplete="off"
              disabled={mic !== 'idle'}
            />
            <button
              type="button"
              className={mic === 'recording' ? 'btn btn-red py-2 animate-pulse' : 'btn btn-chrome py-2'}
              onClick={() => void toggleMic()}
              disabled={pending || mic === 'transcribing'}
              aria-pressed={mic === 'recording'}
              aria-label={t('mic')}
            >
              {mic === 'recording' ? t('listening') : mic === 'transcribing' ? t('transcribing') : t('mic')}
            </button>
            <button type="submit" className="btn btn-red py-2" disabled={pending || mic !== 'idle'}>
              {t('send')}
            </button>
          </form>
          <p className="bg-paper px-3 pb-2 text-[0.7rem] text-muted">
            {micNote ? <span className="mr-2 font-extrabold text-red">{micNote}</span> : null}
            {t('fine')}{' '}
            <a href={house.phoneHref} className="font-extrabold text-red">
              {house.phone}
            </a>
          </p>
        </div>
      ) : null}
      <button
        type="button"
        className="pointer-events-auto inline-flex items-center gap-2 border-4 border-ink bg-red px-3 py-2 text-white shadow-[4px_4px_0_#1c1c1c]"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <HostFace />
        <span className="font-heading text-lg font-extrabold tracking-wide uppercase">{open ? t('close') : t('open')}</span>
      </button>
    </div>
  );
}
