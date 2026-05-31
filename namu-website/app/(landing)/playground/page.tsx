"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";
import { Footer } from "@/components/landing/Footer";
import styles from "./playground.module.css";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Tab = "llm" | "tts" | "asr" | "vision";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface LLMConfig   { model: string; temperature: number; maxTokens: number; topP: number; systemMessage: string; }
interface TTSConfig   { model: string; language: string; speed: number; }
interface ASRConfig   { model: string; language: string; }
interface VisionConfig{ model: string; task: string; }

// ─────────────────────────────────────────────
// API placeholders  — replace with your endpoints
// ─────────────────────────────────────────────
async function apiLLM(_msgs: ChatMessage[], _cfg: LLMConfig): Promise<string> {
  // const res = await fetch("/api/namu/llm", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ messages:_msgs, ..._cfg }) });
  // return (await res.json()).content;
  await new Promise(r => setTimeout(r, 900));
  return "This is a placeholder response. Wire your Namu_llm endpoint to receive real output from the model.";
}

async function apiTTS(_text: string, _cfg: TTSConfig): Promise<Blob> {
  // const res = await fetch("/api/namu/tts", { method:"POST", body: JSON.stringify({ text:_text, ..._cfg }) });
  // return res.blob();
  throw new Error("Connect your Namu_tts endpoint to hear real audio.");
}

async function apiASR(_audio: Blob, _cfg: ASRConfig): Promise<string> {
  // const form = new FormData(); form.append("audio", _audio);
  // const res = await fetch("/api/namu/asr", { method:"POST", body: form });
  // return (await res.json()).transcript;
  await new Promise(r => setTimeout(r, 700));
  return "Connect your Namu_asr endpoint to see real transcriptions here.";
}

async function apiVision(_b64: string, _prompt: string, _cfg: VisionConfig): Promise<string> {
  // const res = await fetch("/api/namu/vision", { method:"POST", body: JSON.stringify({ image:_b64, prompt:_prompt, ..._cfg }) });
  // return (await res.json()).analysis;
  await new Promise(r => setTimeout(r, 800));
  return "Connect your Namu Vision endpoint to analyse images.";
}

// ─────────────────────────────────────────────
// Animated placeholder input
// ─────────────────────────────────────────────
function AnimatedInput({
  value, onChange, onKeyDown, rows = 1, hints, className,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  rows?: number;
  hints: string[];
  className?: string;
}) {
  const [hintIndex, setHintIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (hints.length < 2) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setHintIndex(i => (i + 1) % hints.length);
        setFading(false);
      }, 420);
    }, 3200);
    return () => clearInterval(id);
  }, [hints]);

  return (
    <div className={styles.animInputWrap}>
      {/* Animated placeholder — hidden once user types */}
      {value === "" && (
        <span className={`${styles.animHint} ${fading ? styles.animHintOut : styles.animHintIn}`}>
          {hints[hintIndex]}
        </span>
      )}
      <textarea
        className={`${className ?? ""} ${styles.animTextarea}`}
        value={value}
        rows={rows}
        /* No placeholder so our custom one is the only hint shown */
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared atoms
// ─────────────────────────────────────────────
function Spinner() {
  return <span className={styles.spinner} aria-hidden />;
}

function Slider({ label, value, min, max, step, onChange, fmt }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; fmt?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={styles.sliderWrap}>
      <div className={styles.sliderHead}>
        <span className={styles.sliderLabel}>{label}</span>
        <span className={styles.sliderVal}>{fmt ? fmt(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={styles.slider} />
    </div>
  );
}

function Select({ label, value, options, onChange }: {
  label: string; value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.selectWrap}>
      <label className={styles.selectLabel}>{label}</label>
      <select className={styles.select} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─────────────────────────────────────────────
// Welcome / empty-state screen
// ─────────────────────────────────────────────
interface Suggestion { label: string; text: string; }

function WelcomeScreen({
  icon, headline, sub, suggestions, onSelect,
}: {
  icon: React.ReactNode;
  headline: string;
  sub: string;
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
}) {
  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeIconWrap}>{icon}</div>
      <h2 className={styles.welcomeHeadline}>{headline}</h2>
      <div className={styles.welcomeGrid}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            className={styles.welcomeCard}
            style={{ animationDelay: `${100 + i * 70}ms` }}
            onClick={() => onSelect(s.text)}
          >
            <span className={styles.welcomeCardLabel}>{s.label}</span>
            <span className={styles.welcomeCardText}>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Config sidebar
// ─────────────────────────────────────────────
function ConfigPanel({ children }: { children: React.ReactNode }) {
  return (
    <aside className={styles.config}>
      <p className={styles.configHead}>Configuration</p>
      <div className={styles.configBody}>{children}</div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// LLM Chat tab
// ─────────────────────────────────────────────
const LLM_SUGGESTIONS: Suggestion[] = [
  { label: "Try this prompt",  text: "Explain how large language models work, simply." },
  { label: "Hausa language",   text: "Write a short greeting in Hausa for a business meeting." },
  { label: "Translation",      text: "Translate 'Good morning, how are you?' into Hausa." },
  { label: "Creative writing", text: "Write a brief story set in Niamey, Niger." },
];

function LLMTab() {
  const [cfg, setCfg] = useState<LLMConfig>({
    model: "Namu_llm", temperature: 0.7, maxTokens: 2048, topP: 0.9,
    systemMessage: "You are a helpful AI assistant that speaks Hausa and English.",
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput(""); setError(null);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    try {
      const reply = await apiLLM(next, cfg);
      setMessages(m => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setLoading(false); }
  }, [input, loading, messages, cfg]);

  return (
    <div className={styles.layout}>
      <div className={styles.chatShell}>
        {/* System prompt */}
        <div className={styles.sysRow}>
          <span className={styles.sysTag}>System</span>
          <textarea className={styles.sysInput} rows={1}
            value={cfg.systemMessage}
            onChange={e => setCfg(c => ({ ...c, systemMessage: e.target.value }))}
            placeholder="System instructions…" />
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <WelcomeScreen
              headline="Ask Namu anything"
              sub="Powered by Namu_llm — built for African languages"
              suggestions={LLM_SUGGESTIONS}
              onSelect={send}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
          ) : (
            <>
              {messages.map(m => (
                <div key={m.id}
                  className={`${styles.msg} ${m.role === "user" ? styles.msgUser : styles.msgBot}`}>
                  <span className={styles.msgAuthor}>{m.role === "user" ? "You" : "Namu"}</span>
                  <p className={styles.msgText}>{m.content}</p>
                </div>
              ))}
              {loading && (
                <div className={`${styles.msg} ${styles.msgBot}`}>
                  <span className={styles.msgAuthor}>Namu</span>
                  <div className={styles.dots}><span /><span /><span /></div>
                </div>
              )}
              {error && <p className={styles.errMsg}>{error}</p>}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={styles.inputBar}>
          <AnimatedInput
            value={input}
            onChange={setInput}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            className={styles.inputField}
            hints={[
              "Ask Namu about African languages…",
              "Write a Hausa poem for me…",
              "Translate 'Good morning' into Hausa…",
              "Tell me something about Niger…",
              "What can Namu_llm do?",
            ]}
          />
          <button className={styles.sendBtn} onClick={() => send()} disabled={loading || !input.trim()}>
            {loading ? <Spinner /> : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <ConfigPanel>
        <Select label="Model" value={cfg.model}
          options={[{ value: "Namu_llm", label: "Namu_llm" }]}
          onChange={v => setCfg(c => ({ ...c, model: v }))} />
        <Slider label="Temperature" value={cfg.temperature} min={0} max={2} step={0.05}
          fmt={v => v.toFixed(2)} onChange={v => setCfg(c => ({ ...c, temperature: v }))} />
        <Slider label="Top P" value={cfg.topP} min={0} max={1} step={0.05}
          fmt={v => v.toFixed(2)} onChange={v => setCfg(c => ({ ...c, topP: v }))} />
        <div className={styles.fieldGroup}>
          <label className={styles.selectLabel}>Max tokens</label>
          <input type="number" className={styles.numInput} value={cfg.maxTokens} min={64} max={8192}
            onChange={e => setCfg(c => ({ ...c, maxTokens: parseInt(e.target.value) || 2048 }))} />
        </div>
        <button className={styles.ghostBtn} onClick={() => setMessages([])}>Clear conversation</button>
      </ConfigPanel>
    </div>
  );
}

// ─────────────────────────────────────────────
// TTS tab
// ─────────────────────────────────────────────
const TTS_SUGGESTIONS: Suggestion[] = [
  { label: "Hausa greeting",  text: "Barka da zuwa, ina fata komai yana da kyau a gare ku." },
  { label: "Introduction",    text: "Sunana Namu AI. Ina iya taimaka ku da harshen Hausa." },
  { label: "Custom phrase",   text: "A yau muna gabatar da sabon samfurin harshe na Afirka." },
];

function TTSTab() {
  const [cfg, setCfg] = useState<TTSConfig>({ model: "Namu_tts", language: "ha", speed: 1.0 });
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generate = async () => {
    if (!text.trim() || loading) return;
    setError(null); setAudioUrl(null); setLoading(true);
    try {
      const blob = await apiTTS(text, cfg);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setTimeout(() => audioRef.current?.play(), 80);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate speech.");
    } finally { setLoading(false); }
  };

  const useExample = (t: string) => { setText(t); };

  return (
    <div className={styles.layout}>
      <div className={styles.ttsShell}>
        {text === "" && !audioUrl ? (
          <WelcomeScreen
            headline="Type text, hear it in Hausa"
            sub="Powered by Namu_tts — natural African language voices"
            suggestions={TTS_SUGGESTIONS}
            onSelect={useExample}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
        ) : (
          <div className={styles.ttsContent}>
            <label className={styles.fieldLabel}>Text to synthesise</label>
            {audioUrl && !loading && (
              <div className={styles.audioCard}>
                <audio ref={audioRef} src={audioUrl} controls className={styles.audio} />
                <a href={audioUrl} download="namu.mp3" className={styles.dlLink}>↓ Download MP3</a>
              </div>
            )}
          </div>
        )}

        <div className={styles.ttsInputArea}>
          <AnimatedInput
            value={text}
            onChange={setText}
            rows={4}
            className={styles.ttsTextarea}
            hints={[
              "Barka da zuwa, ina fata komai yana da kyau…",
              "Type any Hausa text to hear it spoken…",
              "Namu AI yana iya magana da Hausa sosai…",
              "Sannu, yaya lafiyar ku?",
            ]}
          />
          <div className={styles.ttsActions}>
            <span className={styles.charCount}>{text.length} chars</span>
            <button className={styles.primaryBtn} onClick={generate} disabled={loading || !text.trim()}>
              {loading ? <><Spinner />Generating…</> : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Generate speech
                </>
              )}
            </button>
          </div>
        </div>
        {error && <p className={styles.errMsg}>{error}</p>}
      </div>

      <ConfigPanel>
        <Select label="Model" value={cfg.model}
          options={[{ value: "Namu_tts", label: "Namu_tts" }]}
          onChange={v => setCfg(c => ({ ...c, model: v }))} />
        <Select label="Language" value={cfg.language}
          options={[
            { value: "ha", label: "Hausa" },
            { value: "fr", label: "French" },
            { value: "en", label: "English" },
          ]}
          onChange={v => setCfg(c => ({ ...c, language: v }))} />
        <Slider label="Speed" value={cfg.speed} min={0.5} max={2.0} step={0.1}
          fmt={v => `${v.toFixed(1)}×`} onChange={v => setCfg(c => ({ ...c, speed: v }))} />
      </ConfigPanel>
    </div>
  );
}

// ─────────────────────────────────────────────
// ASR tab
// ─────────────────────────────────────────────
function ASRTab() {
  const [cfg, setCfg] = useState<ASRConfig>({ model: "Namu_asr", language: "auto" });
  const [recording, setRecording] = useState(false);
  const [secs, setSecs] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const transcribe = async (blob: Blob) => {
    setLoading(true);
    try { setTranscript(await apiASR(blob, cfg)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Transcription failed."); }
    finally { setLoading(false); }
  };

  const start = async () => {
    setError(null); setTranscript(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        transcribe(new Blob(chunksRef.current, { type: "audio/webm" }));
      };
      mr.start(); mrRef.current = mr;
      setRecording(true); setSecs(0);
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch { setError("Microphone access denied."); }
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    mrRef.current?.stop(); setRecording(false);
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className={styles.layout}>
      <div className={styles.asrShell}>
        {/* Record zone */}
        <div className={styles.recordZone}>
          <button className={`${styles.recordBtn} ${recording ? styles.recordBtnOn : ""}`}
            onClick={recording ? stop : start}>
            <div className={`${styles.recDot} ${recording ? styles.recDotOn : ""}`} />
          </button>
          <div className={styles.recMeta}>
            {recording
              ? <><span className={styles.recLabel}>Recording</span><span className={styles.recTimer}>{fmt(secs)}</span></>
              : <span className={styles.recHint}>{transcript ? "Record again" : "Tap to record"}</span>
            }
          </div>
          <span className={styles.orSep}>or</span>
          <label className={styles.uploadBtn}>
            <input type="file" accept="audio/*" className={styles.fileHidden}
              onChange={e => { const f = e.target.files?.[0]; if (f) transcribe(f); }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload file
          </label>
        </div>

        {/* Output */}
        <div className={styles.transcriptShell}>
          <label className={styles.fieldLabel}>Transcript</label>
          {!loading && !transcript && !error && (
            <p className={styles.placeholder}>Your transcription will appear here after recording.</p>
          )}
          {loading && <div className={styles.transcriptLoading}><Spinner /><span>Transcribing…</span></div>}
          {error && <p className={styles.errMsg}>{error}</p>}
          {transcript && (
            <div className={styles.transcriptCard}>
              <p>{transcript}</p>
              <button className={styles.ghostBtn} onClick={() => navigator.clipboard.writeText(transcript)}>
                Copy text
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfigPanel>
        <Select label="Model" value={cfg.model}
          options={[{ value: "Namu_asr", label: "Namu_asr" }]}
          onChange={v => setCfg(c => ({ ...c, model: v }))} />
        <Select label="Language" value={cfg.language}
          options={[
            { value: "auto", label: "Auto-detect" },
            { value: "ha",   label: "Hausa" },
            { value: "fr",   label: "French" },
            { value: "en",   label: "English" },
          ]}
          onChange={v => setCfg(c => ({ ...c, language: v }))} />
      </ConfigPanel>
    </div>
  );
}

// ─────────────────────────────────────────────
// Vision tab
// ─────────────────────────────────────────────
const VISION_SUGGESTIONS: Suggestion[] = [
  { label: "Describe",  text: "Describe everything you can see in this image." },
  { label: "Read text", text: "Is there any text visible? What does it say?" },
  { label: "Identify",  text: "What are the main objects or people in this image?" },
  { label: "Analyse",   text: "What is happening in this scene?" },
];

function VisionTab() {
  const [cfg, setCfg] = useState<VisionConfig>({ model: "Namu_vision", task: "describe" });
  const [b64, setB64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const load = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      setPreview(src); setB64(src.split(",")[1] ?? src);
      setResponse(null);
    };
    reader.readAsDataURL(file);
  };

  const analyse = async (promptOverride?: string) => {
    if (!b64 || loading) return;
    const p = (promptOverride ?? prompt).trim() || "Describe this image.";
    setError(null); setResponse(null); setLoading(true);
    try { setResponse(await apiVision(b64, p, cfg)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Analysis failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.visionShell}>
        {!b64 ? (
          <WelcomeScreen
            headline="Drop an image to analyse"
            sub="Powered by Namu Vision — understanding images in context"
            suggestions={VISION_SUGGESTIONS}
            onSelect={t => { setPrompt(t); }}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
        ) : (
          <div className={styles.visionPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview!} alt="Preview" className={styles.previewImg} />
            <button className={styles.removeBtn} onClick={() => { setB64(null); setPreview(null); setResponse(null); }}>✕</button>
          </div>
        )}

        {/* Drop zone overlay when no image */}
        {!b64 && (
          <label
            className={`${styles.dropZone} ${drag ? styles.dropZoneOn : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) load(f); }}
          >
            <input type="file" accept="image/*" className={styles.fileHidden} onChange={e => { const f = e.target.files?.[0]; if (f) load(f); }} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>Drag & drop or <span>choose file</span></p>
            <small>PNG, JPG, WEBP</small>
          </label>
        )}

        {/* Prompt + response */}
        {b64 && (
          <div className={styles.visionInteract}>
            <div className={styles.visionInputRow}>
              <input className={styles.visionInput} value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") analyse(); }}
                placeholder="Ask a question about the image…" />
              <button className={styles.primaryBtn} onClick={() => analyse()} disabled={loading}>
                {loading ? <Spinner /> : "Analyse"}
              </button>
            </div>
            {error && <p className={styles.errMsg}>{error}</p>}
            {response && <div className={styles.visionResponse}><p>{response}</p></div>}
          </div>
        )}
      </div>

      <ConfigPanel>
        <Select label="Model" value={cfg.model}
          options={[{ value: "Namu_vision", label: "Namu Vision" }]}
          onChange={v => setCfg(c => ({ ...c, model: v }))} />
        <Select label="Task" value={cfg.task}
          options={[
            { value: "describe", label: "Describe image" },
            { value: "answer",   label: "Answer question" },
            { value: "detect",   label: "Detect objects" },
          ]}
          onChange={v => setCfg(c => ({ ...c, task: v }))} />
      </ConfigPanel>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
const TABS: { id: Tab; label: string }[] = [
  { id: "llm",    label: "LLM Chat"       },
  { id: "tts",    label: "Text to Speech" },
  { id: "asr",    label: "Speech to Text" },
  { id: "vision", label: "Vision"         },
];

export default function PlaygroundPage() {
  const [active, setActive] = useState<Tab>("llm");

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHead}>
        <div className={styles.pageHeadLeft}>
          <Link href="/" className={styles.brandLink}>
            <NamuLogoMark variant="onLight" height={20} />
          </Link>
          <span className={styles.separator} aria-hidden>/</span>
          <span className={styles.pageTitle}>Playground</span>
          <span className={styles.beta}>Beta</span>
        </div>
        <span className={styles.pageHint}>Try our models — no account required</span>
      </div>

      {/* Tab bar */}
      <div className={styles.tabs}>
        <div className={styles.tabsInner}>
          {TABS.map(t => (
            <button key={t.id}
              className={`${styles.tab} ${active === t.id ? styles.tabActive : ""}`}
              onClick={() => setActive(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className={styles.workspace}>
        {active === "llm"    && <LLMTab />}
        {active === "tts"    && <TTSTab />}
        {active === "asr"    && <ASRTab />}
        {active === "vision" && <VisionTab />}
      </div>

      {/* Get Started — split layout with iPhone mockup */}
      <section className="try-section">
        {/* Split: text left, phone right */}
        <div className={styles.gsInner}>
          {/* Left — text + CTA */}
          <div className={styles.gsText}>
            <h2 className={styles.gsTitle}>Get Started Today<br />with Namu App</h2>
            <a href="#" className={styles.gsBtn}>Download</a>
          </div>

          {/* Right — iPhone 15 Pro mockup + floating chips */}
          <div className={styles.gsPhoneWrap}>
            <div className={styles.gsPhone}>
              {/* Side buttons */}
              <span className={styles.btnAction} aria-hidden="true" />
              <span className={styles.btnVolUp}  aria-hidden="true" />
              <span className={styles.btnVolDn}  aria-hidden="true" />
              <span className={styles.btnPower}  aria-hidden="true" />

              {/* Screen */}
              <div className={styles.gsScreen}>
                <div className={styles.dynamicIsland} aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/namu_app.png"
                  alt="Namu app interface"
                  className={styles.screenImg}
                />
                {/* Home indicator */}
                <div className={styles.homeBar} aria-hidden="true" />
              </div>
            </div>

            {/* Floating word chips around the phone */}
            <span className={`${styles.floatChip} ${styles.floatChip1}`} aria-hidden="true">Ilimi</span>
            <span className={`${styles.floatChip} ${styles.floatChip2}`} aria-hidden="true">Rubuta</span>
            <span className={`${styles.floatChip} ${styles.floatChip3}`} aria-hidden="true">Fahimta</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
