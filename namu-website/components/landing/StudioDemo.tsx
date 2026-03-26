"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./StudioDemo.module.css";

type StoryId = 1 | 2 | 3;
type SessionId = "developer" | "business" | "learner";
type TabId =
  | "index.html"
  | "style.css"
  | "app.js"
  | "TechShop-logo"
  | "brand-colors"
  | "Bude Asusun"
  | "Takardar taimako";
type OverlayMode = "none" | "story-2" | "story-3" | "loop";
type TypingSchedule = { stamps: number[] };

const BASE_W = 1440;
const BASE_H = 810;
const LOOP_MS = 155000;
/** Exported for shared clocks (e.g. multi-device mockups) */
export const STUDIO_DEMO_LOOP_MS = LOOP_MS;

const T = {
  story1Start: 0,
  story1TypingStart: 4000,
  story1Submit: 11800,
  story1CodeStart: 12500,
  story1CodeEnd: 26000,
  story1PreviewReady: 26000,
  story1AiText: 27000,
  story1HoldEnd: 38000,
  transition1Start: 38000,
  transition1End: 40500,
  story2Start: 40500,
  story2TypingStart: 44500,
  story2Submit: 52800,
  story2GenerateStart: 56000,
  story2AiText: 67000,
  story2Select: 68000,
  story2HoldEnd: 83000,
  transition2Start: 83000,
  transition2End: 85500,
  story3Start: 85500,
  story3VoiceStart: 88000,
  story3VoiceStop: 95000,
  story3TranscribeStart: 95600,
  story3Submit: 97300,
  story3AnswerStart: 99500,
  story3SummaryStart: 111000,
  story3OutputPill: 112000,
  story3FollowPrompt: 116000,
  story3FollowSubmit: 118600,
  story3FollowAnswer: 120000,
  story3FollowPill: 122000,
  story3HoldEnd: 140000,
  loopOverlayStart: 140000,
  loopOverlayIcons: 145000,
  loopResetStart: 150000,
  loopResetEnd: 155000,
} as const;

const STORY_STARTS: Record<StoryId, number> = { 1: T.story1Start, 2: T.story2Start, 3: T.story3Start };
const STORY_LABELS: Record<StoryId, string> = { 1: "Masu Gina", 2: "Kasuwanci", 3: "Koyo" };

const INITIAL_HTML = `<!DOCTYPE html>
<html lang="ha">
<head>
  <meta charset="UTF-8">
  <title>App</title>
</head>
<body>
  <div class="app">
    <h1>Barka da zuwa</h1>
    <!-- Ana gina... -->
  </div>
</body>
</html>`;

const FINAL_HTML = `<!DOCTYPE html>
<html lang="ha">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <title>Namu - Shiga</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">N</div>
        <span class="brand-name">Namu</span>
      </div>
      <div class="login-header">
        <h1>Barka da Zuwa</h1>
        <p>Shiga asusunka don ci gaba</p>
      </div>
      <form class="login-form">
        <div class="form-group">
          <label>Imel dinka</label>
          <input type="email" placeholder="misali@namu.ai">
        </div>
        <div class="form-group">
          <label>Kalmar sirri</label>
          <input type="password" placeholder="********">
          <span class="show-pass">Nuna</span>
        </div>
        <div class="form-options">
          <label><input type="checkbox">Ka tuna ni</label>
          <a href="#">Ka manta sirri?</a>
        </div>
        <button type="submit" class="btn-primary">Shiga</button>
        <div class="divider"><span>ko</span></div>
        <button class="btn-google">Shiga da Google</button>
      </form>
      <p class="signup">Ba ka da asusi?<a href="#">Kirkira yanzu</a></p>
    </div>
  </div>
</body>
</html>`;

const STORY1_PROMPT = "Yi mini login form mai kyau da email, password da button na Shiga - a harshen Hausa";
const STORY2_PROMPT = "Ina son logo don kasuwancina - TechShop. Yana sayar da kayan lantarki. Ina son launi mai kyau da rubutu mai karfi";
const STORY3_VOICE_TEXT = "Ina son sanin yadda ake bude asusun banki a Niger - wane banki ya fi kyau?";
const STORY3_FOLLOWUP = "BIA Niger - nawa ne kudin farko?";

const LOGO_CONCEPTS = [
  { id: 1, name: "Ra'ayi 1 - Sauki", variant: "classic" },
  { id: 2, name: "Ra'ayi 2 - Na Zamani", variant: "modern" },
  { id: 3, name: "Ra'ayi 3 - Saukin zamani", variant: "minimal" },
] as const;

function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function inRange(time: number, start: number, end: number) { return time >= start && time < end; }
function deterministicOffset(index: number, variance: number, seed: number) {
  const raw = Math.sin((index + 1) * 12.9898 + seed * 78.233) * 43758.5453;
  const normalized = raw - Math.floor(raw);
  return (normalized * 2 - 1) * variance;
}
function buildTypingSchedule(text: string, startMs: number, baseDelay: number, variance: number, pauses: Record<number, number>) {
  const stamps: number[] = [];
  let cursor = startMs;
  for (let i = 0; i < text.length; i += 1) {
    cursor += Math.max(20, baseDelay + deterministicOffset(i, variance, startMs));
    if (pauses[i] !== undefined) cursor += pauses[i];
    stamps.push(Math.round(cursor));
  }
  return { stamps };
}
function countTyped(schedule: TypingSchedule, now: number) {
  let lo = 0; let hi = schedule.stamps.length - 1; let answer = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (schedule.stamps[mid] <= now) { answer = mid; lo = mid + 1; } else { hi = mid - 1; }
  }
  return answer + 1;
}
function buildLineTimes(start: number, lines: string[], baseDelay: number, variance: number) {
  const times: number[] = []; let cursor = start;
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    let delay = baseDelay + deterministicOffset(i, variance, start);
    if (!trimmed) delay = 120;
    if (trimmed.startsWith("<!--")) delay = 260;
    if (trimmed.startsWith("</")) delay = 180;
    cursor += Math.max(80, delay);
    times.push(Math.round(cursor));
  }
  return times;
}
function countLines(times: number[], now: number) {
  let lo = 0; let hi = times.length - 1; let answer = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (times[mid] <= now) { answer = mid; lo = mid + 1; } else { hi = mid - 1; }
  }
  return answer + 1;
}
function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function highlightHtml(line: string) {
  if (!line.trim()) return "&nbsp;";
  const trimmed = line.trim();
  if (trimmed.startsWith("<!--")) return `<span class="synComment">${escapeHtml(line)}</span>`;
  if (trimmed.toUpperCase().startsWith("<!DOCTYPE")) return `<span class="synKeyword">${escapeHtml(line)}</span>`;
  const tagMatch = line.match(/^(\s*)(<\/?)([a-zA-Z0-9-]+)([^>]*?)(\/?>)$/);
  if (!tagMatch) return escapeHtml(line);
  const [, indent, opener, tagName, attrBlock, closer] = tagMatch;
  let output = `${escapeHtml(indent)}<span class="synTag">${escapeHtml(opener + tagName)}</span>`;
  let cursor = 0;
  const attrRegex = /(\s+)([a-zA-Z-:]+)(=)?("[^"]*")?/g;
  let match: RegExpExecArray | null = attrRegex.exec(attrBlock);
  while (match) {
    const [full, spacing, attrName, equals = "", attrValue = ""] = match;
    output += escapeHtml(attrBlock.slice(cursor, match.index));
    output += escapeHtml(spacing);
    output += `<span class="synAttr">${escapeHtml(attrName)}</span>`;
    output += escapeHtml(equals);
    if (attrValue) output += `<span class="synString">${escapeHtml(attrValue)}</span>`;
    cursor = match.index + full.length;
    match = attrRegex.exec(attrBlock);
  }
  output += escapeHtml(attrBlock.slice(cursor));
  output += `<span class="synTag">${escapeHtml(closer)}</span>`;
  return output;
}
function getStory(elapsed: number): StoryId {
  if (elapsed >= T.story3Start && elapsed < T.loopResetStart) return 3;
  if (elapsed >= T.story2Start && elapsed < T.transition2Start) return 2;
  return 1;
}
function getOverlayMode(elapsed: number): OverlayMode {
  if (inRange(elapsed, T.transition1Start, T.transition1End)) return "story-2";
  if (inRange(elapsed, T.transition2Start, T.transition2End)) return "story-3";
  if (inRange(elapsed, T.loopOverlayStart, T.loopResetEnd)) return "loop";
  return "none";
}

export function StudioDemo({
  autoPlay = true,
  loop = true,
  startDelayMs = 0,
  showControls = true,
  showStoryPills = true,
  /** When set, animation time is driven externally (single clock for multiple viewports). */
  controlledElapsedMs,
  /** Minimum UI scale when the container is very small (e.g. phone mask in a mockup). */
  scaleFloor = 0,
}: {
  autoPlay?: boolean;
  loop?: boolean;
  startDelayMs?: number;
  showControls?: boolean;
  showStoryPills?: boolean;
  controlledElapsedMs?: number;
  scaleFloor?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const codeScrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const elapsedRef = useRef(0);
  const [scale, setScale] = useState(1);
  const [internalElapsed, setInternalElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(
    autoPlay && startDelayMs === 0 && controlledElapsedMs === undefined,
  );

  const elapsed = controlledElapsedMs ?? internalElapsed;

  const initialHtmlLines = useMemo(() => INITIAL_HTML.split("\n"), []);
  const finalHtmlLines = useMemo(() => FINAL_HTML.split("\n"), []);
  const htmlLineTimes = useMemo(() => buildLineTimes(T.story1CodeStart, finalHtmlLines, 220, 40), [finalHtmlLines]);
  const typingStory1 = useMemo(() => buildTypingSchedule(STORY1_PROMPT, T.story1TypingStart, 55, 25, { 31: 500, 38: 400, 50: 350 }), []);
  const typingStory2 = useMemo(() => buildTypingSchedule(STORY2_PROMPT, T.story2TypingStart, 55, 20, { 29: 600, 40: 700, 73: 500 }), []);
  const transcribeStory3 = useMemo(() => buildTypingSchedule(STORY3_VOICE_TEXT, T.story3TranscribeStart, 30, 6, {}), []);
  const typingStory3Follow = useMemo(() => buildTypingSchedule(STORY3_FOLLOWUP, T.story3FollowPrompt, 50, 12, {}), []);
  useEffect(() => {
    const computeScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      if (width < 4 || height < 4) return;
      const raw = Math.min(width / BASE_W, height / BASE_H);
      setScale(Math.max(raw, scaleFloor));
    };
    computeScale();
    const observer = new ResizeObserver(computeScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [scaleFloor]);

  useEffect(() => {
    if (controlledElapsedMs !== undefined) return;

    const tick = (timestamp: number) => {
      if (!lastTsRef.current) lastTsRef.current = timestamp;
      const delta = timestamp - lastTsRef.current;
      lastTsRef.current = timestamp;
      if (isPlaying) {
        elapsedRef.current += delta;
        if (elapsedRef.current >= LOOP_MS) {
          if (loop) {
            elapsedRef.current %= LOOP_MS;
          } else {
            elapsedRef.current = LOOP_MS;
            setIsPlaying(false);
          }
        }
        setInternalElapsed(elapsedRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, loop, controlledElapsedMs]);

  useEffect(() => {
    if (controlledElapsedMs !== undefined) {
      setIsPlaying(true);
      return;
    }
    if (!autoPlay) {
      setIsPlaying(false);
      return;
    }
    if (startDelayMs <= 0) {
      setIsPlaying(true);
      return;
    }

    setIsPlaying(false);
    let acc = 0;
    let last = 0;
    let raf = 0;
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) return;
      if (!last) last = now;
      acc += now - last;
      last = now;
      if (acc >= startDelayMs) {
        setIsPlaying(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [autoPlay, startDelayMs, controlledElapsedMs]);

  const story = getStory(elapsed);
  const overlayMode = getOverlayMode(elapsed);
  const currentSession: SessionId = story === 1 ? "developer" : story === 2 ? "business" : "learner";
  const activeTab: TabId = story === 1 ? "index.html" : story === 2 ? "TechShop-logo" : "Bude Asusun";
  const tabSet: TabId[] = story === 1 ? ["index.html", "style.css", "app.js"] : story === 2 ? ["TechShop-logo", "brand-colors"] : ["Bude Asusun", "Takardar taimako"];

  const inputText = story === 1
    ? STORY1_PROMPT.slice(0, countTyped(typingStory1, elapsed))
    : story === 2
      ? STORY2_PROMPT.slice(0, countTyped(typingStory2, elapsed))
      : inRange(elapsed, T.story3TranscribeStart, T.story3Submit)
        ? STORY3_VOICE_TEXT.slice(0, countTyped(transcribeStory3, elapsed))
        : inRange(elapsed, T.story3FollowPrompt, T.story3FollowSubmit)
          ? STORY3_FOLLOWUP.slice(0, countTyped(typingStory3Follow, elapsed))
          : "";

  const inputFocused = inRange(elapsed, 3000, T.story1Submit) || inRange(elapsed, 43500, T.story2Submit) || inRange(elapsed, T.story3VoiceStart, T.story3Submit) || inRange(elapsed, 115000, T.story3FollowSubmit);
  const processing = inRange(elapsed, T.story1Submit, T.story1AiText + 800) || inRange(elapsed, T.story2Submit, T.story2AiText + 500) || inRange(elapsed, T.story3Submit, T.story3OutputPill + 500) || inRange(elapsed, T.story3FollowSubmit, T.story3FollowPill + 500);
  const dots = ".".repeat((Math.floor(elapsed / 400) % 3) + 1);
  const progress = `${(elapsed / LOOP_MS) * 100}%`;

  const visibleHtmlLines = story === 1
    ? elapsed < T.story1CodeStart
      ? initialHtmlLines
      : elapsed < T.story1CodeEnd
        ? finalHtmlLines.slice(0, countLines(htmlLineTimes, elapsed))
        : finalHtmlLines
    : finalHtmlLines;

  const story1CursorLine = elapsed < 3000 ? 9 : elapsed < T.story1CodeStart ? 9 : elapsed < T.story1CodeEnd ? clamp(countLines(htmlLineTimes, elapsed), 1, finalHtmlLines.length) : clamp(8 + Math.floor((elapsed - 28000) / 1200), 8, 22);

  useEffect(() => {
    if (story !== 1 || !codeScrollRef.current) return;
    const target = Math.max(0, (story1CursorLine - 6) * 22);
    codeScrollRef.current.scrollTo({ top: target, behavior: "smooth" });
  }, [story, story1CursorLine]);

  const story1PreviewReady = elapsed >= T.story1PreviewReady;
  const story1PreviewFocusPulse = inRange(elapsed, 33000, 34000);
  const story2ConceptCount = elapsed >= 57600 ? 3 : elapsed >= 56800 ? 2 : elapsed >= 56000 ? 1 : 0;
  const story2Selected = elapsed >= T.story2Select ? 2 : 0;
  const story3WaveActive = inRange(elapsed, T.story3VoiceStart, T.story3VoiceStop);
  const story3WaveTranslate = inRange(elapsed, T.story3VoiceStart, T.story3VoiceStop + 1600);
  const story3RecordingSeconds = clamp(Math.floor((elapsed - T.story3VoiceStart) / 1000) + 1, 0, 7);
  const story3Sections = { intro: elapsed >= T.story3AnswerStart, list: elapsed >= 101000, recommendation: elapsed >= 107000, requirements: elapsed >= 110000 };
  const story3SummaryReady = elapsed >= T.story3SummaryStart;
  const story3RecommendationPulse = inRange(elapsed, 126000, 128000);
  const story3SummaryPulse = inRange(elapsed, 132000, 133500);

  const overlayVisible = overlayMode !== "none";
  const overlayLabel = overlayMode === "story-2" ? "Mai Kasuwanci" : overlayMode === "story-3" ? "Dalibi" : "Namu AI-Studio";
  const overlayBody = overlayMode === "story-2" ? "Yana son kirkira logo don kasuwancinsa" : overlayMode === "story-3" ? "Tana son sanin yadda ake bude asusun banki" : "AI cikin harsharka";

  const statusRight = story === 1
    ? ["Layi 23, Ginshiki 1", "UTF-8", "HTML"]
    : story === 2
      ? elapsed >= 67000
        ? ["PNG | SVG | 3 ra'ayoyi", "Kirkira"]
        : ["PNG | SVG | 0 ra'ayoyi", "Kirkira"]
      : elapsed >= T.story3OutputPill
        ? [elapsed >= T.story3FollowPill ? "Tambaya 2 na 3" : "Tambaya 1 na 3", "Koyo"]
        : ["Tambaya 0 na 0", "Koyo"];

  const sessions = [
    { id: "developer" as const, color: styles.sessionCode, name: "Login Page", subtitle: "index.html | Yanzu" },
    { id: "business" as const, color: styles.sessionBusiness, name: "Logo - TechShop", subtitle: "Brand | Daga baya" },
    { id: "learner" as const, color: styles.sessionLearning, name: "Bude Asusun Banki", subtitle: "Koyo | Daga baya" },
  ];

  const waveformBars = useMemo(() => Array.from({ length: 30 }).map((_, index) => ({
    key: index,
    peak: `${4 + ((index * 11) % 25)}px`,
    duration: `${0.35 + ((index * 7) % 45) / 100}s`,
    delay: `${((index * 13) % 24) / 100}s`,
  })), []);

  const jumpToStory = (storyId: StoryId) => {
    if (controlledElapsedMs !== undefined) return;
    elapsedRef.current = STORY_STARTS[storyId];
    setInternalElapsed(STORY_STARTS[storyId]);
  };

  return (
    <div
      className={styles.viewport}
      ref={containerRef}
      data-demo-complete={!loop && elapsed >= LOOP_MS ? "true" : "false"}
    >
      <div className={styles.base} style={{ transform: `scale(${scale})` }}>
        <div className={styles.titleBar}>
          <div className={styles.traffic}>
            <span className={`${styles.light} ${styles.red}`} />
            <span className={`${styles.light} ${styles.yellow}`} />
            <span className={`${styles.light} ${styles.green}`} />
          </div>
          <p className={styles.titleText}>Namu AI-Studio</p>
          <span className={styles.versionPill}>v1.0 Beta</span>
        </div>

        <div className={styles.tabBar}>
          {tabSet.map((tab) => (
            <div key={tab} className={`${styles.tab} ${tab === activeTab ? styles.tabActive : ""}`}>
              {story === 1 && tab === "index.html" && inRange(elapsed, T.story1Submit, T.story1AiText + 800) ? <span className={styles.dirtyDot} /> : null}
              <span>{tab}</span>
            </div>
          ))}
        </div>

        <div className={styles.mainGrid}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}><span>AYYUKA</span><button type="button">+</button></div>
            <div className={styles.sessionsList}>
              {sessions.map((session) => (
                <div key={session.id} className={`${styles.sessionRow} ${currentSession === session.id ? styles.sessionActive : ""}`}>
                  <span className={`${styles.sessionDot} ${session.color}`} />
                  <div><strong>{session.name}</strong><span>{session.subtitle}</span></div>
                </div>
              ))}
            </div>
            <div className={styles.sidebarDivider} />
            <div className={styles.sidebarHeaderSecondary}>KAYAN AIKI</div>
            <div className={styles.toolList}>
              <div className={styles.toolRow}><span className={`${styles.toolIcon} ${styles.toolSearch}`} />Bincike</div>
              <div className={styles.toolRow}><span className={`${styles.toolIcon} ${styles.toolWrite}`} />Rubutu</div>
              <div className={styles.toolRow}><span className={`${styles.toolIcon} ${styles.toolCode}`} />Code</div>
              <div className={styles.toolRow}><span className={`${styles.toolIcon} ${styles.toolCreate}`} />Ƙirƙira</div>
              <div className={styles.toolRow}><span className={`${styles.toolIcon} ${styles.toolVoice}`} />Murya</div>
            </div>
            {showStoryPills ? (
              <div className={styles.storyDock}>
                <div className={styles.storyDockLabel}>MASU AMFANI</div>
                <div className={styles.storyPills}>
                  {([1, 2, 3] as StoryId[]).map((storyId) => (
                    <button key={storyId} type="button" className={`${styles.storyPill} ${story === storyId ? styles.storyPillActive : ""}`} onClick={() => jumpToStory(storyId)}>
                      <span className={`${styles.storyPillDot} ${storyId === 1 ? styles.storyPillCode : storyId === 2 ? styles.storyPillBusiness : styles.storyPillLearning}`} />
                      <span>{STORY_LABELS[storyId]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <section className={styles.mainPanel}>
            {story === 1 ? (
              <div className={styles.codeEditor}>
                <div className={styles.codeScroll} ref={codeScrollRef}>
                  {visibleHtmlLines.map((line, index) => {
                    const lineNumber = index + 1;
                    const active = lineNumber === story1CursorLine;
                    return (
                      <div key={`${lineNumber}-${line}`} className={`${styles.codeLine} ${active ? styles.codeLineActive : ""}`}>
                        <span className={`${styles.lineNo} ${active ? styles.lineNoActive : ""}`}>{lineNumber}</span>
                        <span className={styles.lineContent}>
                          <span dangerouslySetInnerHTML={{ __html: highlightHtml(line) }} />
                          {active ? <span className={styles.cursor} /> : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.minimap}>
                  {Array.from({ length: 54 }).map((_, index) => (
                    <span key={index} className={`${styles.mapLine} ${index % 6 === 0 ? styles.mapOrange : index % 5 === 0 ? styles.mapGreen : styles.mapBlue}`} style={{ width: `${40 + ((index * 19) % 56)}px` }} />
                  ))}
                </div>
              </div>
            ) : story === 2 ? (
              <div className={styles.canvasPanel}>
                <div className={styles.canvasBoard}>
                  {story2ConceptCount === 0 ? (
                    <div className={styles.canvasPlaceholder}><span className={styles.canvasIcon} /><p>Sakamakon zai bayyana anan</p></div>
                  ) : (
                    <div className={styles.logoGrid}>
                      {LOGO_CONCEPTS.slice(0, story2ConceptCount).map((concept) => (
                        <article key={concept.id} className={`${styles.logoCard} ${story2Selected === concept.id ? styles.logoSelected : ""}`}>
                          <div className={styles.logoVisualWrap}>
                            {concept.variant === "classic" ? (
                              <div className={styles.logoClassic}><span>TS</span></div>
                            ) : concept.variant === "modern" ? (
                              <div className={styles.logoModern}><span>T</span><strong><b>Tech</b><i>Shop</i></strong></div>
                            ) : (
                              <div className={styles.logoMinimal}><div>TS</div><strong>TECHSHOP</strong></div>
                            )}
                          </div>
                          <p>{concept.name}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.learningPanel}>
                {elapsed < T.story3Submit ? (
                  <div className={styles.learningEmpty}><span className={styles.learningLogo}>N</span><h3>Yau za ka iya koyo da Hausa</h3><p>Tambaya ko nema taimako a harsheka</p></div>
                ) : (
                  <div className={styles.answerScroll}>
                    <div className={styles.answerUserCard}><span className={styles.voiceBubbleIcon} /><p>{STORY3_VOICE_TEXT}</p></div>
                    <div className={styles.answerAiCard}>
                      <div className={styles.answerMeta}>* Namu AI</div>
                      {story3Sections.intro ? <p>A Niger, akwai manyan bankuna da za ka iya bude asusunka a cikinsu. Zan ba ka bayani a takaice:</p> : null}
                      {story3Sections.list ? (
                        <div className={styles.answerList}>
                          <div><strong>1. BIA Niger (Banque Islamique de l'Afrique)</strong><p>Yana da aminci sosai. Za ka iya bude asusun da CFA 10,000 kawai. Akwai reshe a ko'ina cikin Niamey.</p></div>
                          <div><strong>2. Ecobank Niger</strong><p>Yana da kyau musamman don aika kudi zuwa kasashen waje. App din su yana aiki da kyau a wayar hannu.</p></div>
                          <div><strong>3. Banque Atlantique Niger</strong><p>Sauki ne don Kirkira. Ana iya fara online, amma dole ne ka je reshe don kammala.</p></div>
                        </div>
                      ) : null}
                      {story3Sections.recommendation ? (
                        <div className={`${styles.recommendBox} ${story3RecommendationPulse ? styles.recommendPulse : ""}`}><span>SHAWARAR NAMU AI</span><p>Don farawa, muna ba da shawara BIA Niger ko Ecobank. Dukkansu ba sa bukatar yawan kudi don fara, kuma yana da sauki a Niamey.</p></div>
                      ) : null}
                      {story3Sections.requirements ? (
                        <div className={styles.requirementsBox}>
                          <strong>Abin da kake bukata:</strong>
                          <ul>
                            <li>- Katin shaida (carte d'identite)</li>
                            <li>- Wuri da kake zaune (justificatif de domicile)</li>
                            <li>- Adireshi na wayar hannu</li>
                            <li>- Farkon ajiya (kudin farko)</li>
                          </ul>
                        </div>
                      ) : null}
                      {elapsed >= T.story3OutputPill ? <span className={styles.outputPill}>{"-> Tambaya an amsa - Niger bankuna"}</span> : null}
                    </div>
                    {elapsed >= T.story3FollowSubmit ? <div className={styles.answerUserFollow}>{STORY3_FOLLOWUP}</div> : null}
                    {elapsed >= T.story3FollowAnswer ? (
                      <div className={styles.answerAiCardSmall}>
                        <p>Don BIA Niger, kudin farko shine <span className={styles.moneyPill}>CFA 10,000</span> (kusan $16 USD).</p>
                        <p>Amma idan kana so ka bude asusun ajiya (compte epargne), ana iya farawa da CFA 5,000 kawai.</p>
                        <p>Babu kudin shiga a cikin watanni shida na farko.</p>
                        {elapsed >= T.story3FollowPill ? <span className={styles.outputPill}>{"-> BIA Niger - bayani an kara"}</span> : null}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className={styles.rightPanel}>
            {story === 1 ? (
              <>
                <div className={styles.panelHeader}><div className={styles.previewStatus}><span className={`${styles.previewDot} ${story1PreviewReady ? styles.previewDotReady : styles.previewDotLoading}`} /><span>Kallon Kai</span></div></div>
                <div className={styles.previewPanel}>
                  {!story1PreviewReady ? (
                    <div className={styles.previewInitial}><h2>Barka da zuwa</h2></div>
                  ) : (
                    <div className={styles.previewLoginShell}>
                      <div className={styles.previewLoginCard}>
                        <div className={styles.previewBrand}><span>N</span><strong>Namu</strong></div>
                        <div className={styles.previewHeaderText}><h3>Barka da Zuwa</h3><p>Shiga asusunka don ci gaba</p></div>
                        <label>Imel dinka</label>
                        <input className={`${styles.previewInput} ${story1PreviewFocusPulse ? styles.previewInputPulse : styles.previewInputFocus}`} readOnly value="" placeholder="misali@namu.ai" />
                        <label>Kalmar sirri</label>
                        <div className={styles.previewPassword}><input className={styles.previewInput} readOnly value="" placeholder="********" /><span>Nuna</span></div>
                        <div className={styles.previewOptions}><span>[x] Ka tuna ni</span><a href="#">Ka manta sirri?</a></div>
                        <button type="button" className={styles.previewPrimaryButton}>Shiga</button>
                        <div className={styles.previewDivider}><span /><em>ko</em><span /></div>
                        <button type="button" className={styles.previewSecondaryButton}>Shiga da Google</button>
                        <p className={styles.previewSignup}>Ba ka da asusi? <a href="#">Kirkira yanzu</a></p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : story === 2 ? (
              <>
                <div className={styles.panelHeader}><span>Sakamakon</span></div>
                <div className={styles.outputPanel}>
                  {story2ConceptCount === 0 ? (
                    <div className={styles.outputEmpty}>Ana jiran Kirkira...</div>
                  ) : (
                    <>
                      <div className={styles.outputThumbGrid}>
                        {LOGO_CONCEPTS.slice(0, story2ConceptCount).map((concept) => (
                          <div key={concept.id} className={styles.outputThumbCard}>
                            <div className={styles.outputThumbVisual}>{concept.id === 2 ? "T" : "TS"}</div>
                            <button type="button" className={`${styles.selectButton} ${story2Selected === concept.id ? styles.selectButtonActive : ""}`}>{story2Selected === concept.id ? "Zababbe" : "Zaba"}</button>
                          </div>
                        ))}
                      </div>
                      <div className={styles.paletteSection}><strong>Launuka</strong><div className={styles.paletteRow}><span><i style={{ background: "#D6703F" }} />#D6703F</span><span><i style={{ background: "#0C0C0C" }} />#0C0C0C</span><span><i style={{ background: "#FFFFFF", border: "1px solid #ddd" }} />#FFFFFF</span></div></div>
                      <div className={styles.fontSection}><strong>Rubutu</strong><p>DM Sans - Mai karfi da na zamani</p></div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={styles.panelHeader}><span>Takaitawa</span></div>
                <div className={`${styles.summaryPanel} ${story3SummaryPulse ? styles.summaryPulse : ""}`}>
                  {!story3SummaryReady ? (
                    <div className={styles.outputEmpty}>Takaitawa zai bayyana anan</div>
                  ) : (
                    <>
                      <h4>Manyan Bankuna a Niger</h4>
                      <div className={styles.bankPills}><span className={styles.bankPillActive}>BIA Niger</span><span>Ecobank</span><span>Banque Atlantique</span></div>
                      <h5>Takardun da ake bukata</h5>
                      <ul className={styles.summaryList}><li>?- Katin shaida</li><li>?- Wuri da kake zaune</li><li>- Wayar hannu</li><li>- Farkon ajiya</li></ul>
                    </>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
        <div className={styles.statusBar}>
          <div className={styles.statusLeft}><span>* Namu AI-Studio</span><i /><span>{story === 1 ? "Login Page" : story === 2 ? "Logo - TechShop" : "Bude Asusun Banki"}</span></div>
          <div className={styles.statusCenter}>{processing ? <span>* Namu AI yana aiki{dots}</span> : null}</div>
          <div className={styles.statusRight}>{statusRight.map((item, index) => <span key={`${item}-${index}`} className={styles.statusRightItem}>{item}</span>)}</div>
        </div>

        <div className={styles.promptWrap}>
          {story === 3 && story3WaveTranslate ? (
            <div className={`${styles.voiceBar} ${story3WaveActive ? styles.voiceBarVisible : styles.voiceBarTranslate}`}>
              <div className={styles.voiceLeft}>{story3WaveActive ? <span className={styles.recordDot} /> : null}<span>{story3WaveActive ? "Ana daukar murya..." : "Ana fassara murya..."}</span></div>
              <div className={styles.waveform}>{waveformBars.map((bar) => <span key={bar.key} className={`${styles.waveBar} ${story3WaveActive ? styles.waveActive : styles.waveIdle}`} style={{ ["--peak" as string]: bar.peak, ["--duration" as string]: bar.duration, ["--delay" as string]: bar.delay }} />)}</div>
              <div className={styles.voiceTimer}>{story3WaveActive ? `0:0${clamp(story3RecordingSeconds, 1, 7)}` : "0:07"}</div>
            </div>
          ) : null}

          <div className={`${styles.thread} ${(story === 1 && elapsed >= T.story1Submit) || (story === 2 && elapsed >= T.story2Submit) || (story === 3 && elapsed >= T.story3Submit) ? styles.threadOpen : ""}`}>
            {story === 1 && elapsed >= T.story1Submit ? (
              <>
                <div className={styles.userBubbleWrap}><span>Kai | Yanzu</span><div className={styles.userBubble}>{STORY1_PROMPT}</div></div>
                <div className={styles.aiBubbleWrap}><span>* Namu AI</span><div className={styles.aiBubble}>{elapsed < T.story1AiText ? <div className={styles.dotRow}><span /><span /><span /></div> : <><p>Na gina maka login form cikakke da Hausa. Yana da email, password, zabin tuna, da kuma shiga da Google. Komai a Hausa domin masu amfani da ke Niger.</p><div className={styles.outputPill}>{"-> index.html an sabunta"}</div></>}</div></div>
              </>
            ) : null}
            {story === 2 && elapsed >= T.story2Submit ? (
              <>
                <div className={styles.userBubbleWrap}><span>Kai | Yanzu</span><div className={styles.userBubble}>{STORY2_PROMPT}</div></div>
                <div className={styles.aiBubbleWrap}><span>* Namu AI</span><div className={styles.aiBubble}>{elapsed < T.story2AiText ? <div className={styles.dotRow}><span /><span /><span /></div> : <><p>Na Kirkira logo guda uku don TechShop. Ra'ayi na biyu ya fi dacewa da kasuwancin kayan lantarki - yana da karfi kuma na zamani. Za ka iya zabar daya kuma mu gyara shi kamar yadda kake so.</p><div className={styles.outputPill}>{"-> Logo ra'ayoyi 3 an kirkira"}</div></>}</div></div>
              </>
            ) : null}
            {story === 3 && elapsed >= T.story3Submit ? (
              <>
                <div className={styles.userBubbleWrap}><span>Kai | Yanzu</span><div className={styles.userBubble}>{STORY3_VOICE_TEXT}</div></div>
                <div className={styles.aiBubbleWrap}><span>* Namu AI</span><div className={styles.aiBubble}>{elapsed < T.story3AnswerStart ? <div className={styles.dotRow}><span /><span /><span /></div> : <><p>A amsa tana cikin babban panel domin ka karanta ta a fili.</p>{elapsed >= T.story3OutputPill ? <div className={styles.outputPill}>{"-> Tambaya an amsa - Niger bankuna"}</div> : null}</>}</div></div>
                {elapsed >= T.story3FollowSubmit ? <div className={styles.userBubbleWrap}><span>Kai | Yanzu</span><div className={styles.userBubble}>{STORY3_FOLLOWUP}</div></div> : null}
                {elapsed >= T.story3FollowAnswer ? <div className={styles.aiBubbleWrap}><span>* Namu AI</span><div className={styles.aiBubble}><p>Na kara bayani game da kudin farko na BIA Niger.</p>{elapsed >= T.story3FollowPill ? <div className={styles.outputPill}>{"-> BIA Niger - bayani an kara"}</div> : null}</div></div> : null}
              </>
            ) : null}
          </div>

          <div className={styles.inputRow}>
            <div className={`${styles.inputShell} ${inputFocused ? styles.inputFocused : ""} ${processing ? styles.inputBusy : ""}`}>
              <span className={`${styles.sparkle} ${processing ? styles.sparkleFast : styles.sparkleSlow}`}>✦</span>
              <input value={inputText} readOnly placeholder="Rubuta abin da kake son yi..." />
              <button type="button" className={`${styles.micBtn} ${story === 3 && inRange(elapsed, T.story3VoiceStart, T.story3VoiceStop) ? styles.micActive : ""}`} aria-label="Mic"><span className={styles.micGlyph} /></button>
            </div>
            <span className={`${styles.enterBadge} ${inputText ? styles.enterTyping : ""}`}>Enter ↵</span>
          </div>
        </div>



        {showControls ? (
          <div className={styles.controls}><button type="button" className={styles.playPause} onClick={() => setIsPlaying((prev) => !prev)} aria-label={isPlaying ? "Pause demo" : "Play demo"}>{isPlaying ? <span className={styles.pauseGlyph}><i /><i /></span> : <span className={styles.playGlyph} />}</button></div>
        ) : null}
        <div className={styles.progressTrack}><span style={{ width: progress }} /></div>

        {overlayVisible ? (
          <div className={`${styles.overlay} ${overlayMode === "loop" ? styles.overlayLoop : ""}`}>
            <div className={styles.overlayInner}>
              <span className={styles.overlayTag}>NAMU AI-STUDIO</span>
              {overlayMode === "loop" ? <div className={styles.overlayLogo}>N</div> : null}
              <h3>{overlayLabel}</h3>
              <p>{overlayBody}</p>
              {overlayMode === "loop" && elapsed >= T.loopOverlayIcons ? <div className={styles.overlayAudience}><span><i className={styles.audienceCode} />Masu Gina</span><span><i className={styles.audienceBusiness} />Masu Kasuwanci</span><span><i className={styles.audienceLearning} />Masu Koyo</span></div> : null}
            </div>
            <div className={styles.overlayLine} />
          </div>
        ) : null}

        {!isPlaying ? <div className={styles.pausedMask} /> : null}
      </div>
    </div>
  );
}

