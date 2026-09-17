import * as THREE from "three";
import { PLAZA_RADIUS, VIEW_YAW } from "./layout";
import type { Materials } from "./materials";
import { HEX } from "./palette";
import { canvasTexture, mono, rng, serif, speckle } from "./textures";

type Point = [number, number];

/**
 * The plaza: poured rubber with the whole park painted onto it — the paths
 * between stations, the numbers, the two languages facing each other, and the
 * tagline stamped around the rim. Painting the map into the floor is how a real
 * playground tells you where to go, and it means the park reads as a place even
 * before a single sculpture is in frame.
 */
export function createGround(scene: THREE.Scene, m: Materials, detail: "high" | "low") {
  const group = new THREE.Group();

  const size = detail === "high" ? 2048 : 1024;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  paintPlaza(canvas, size);

  const slab = new THREE.Mesh(
    new THREE.CircleGeometry(PLAZA_RADIUS, 128),
    new THREE.MeshStandardMaterial({
      map: canvasTexture(canvas),
      roughness: 0.94,
      metalness: 0,
    }),
  );
  slab.rotation.x = -Math.PI / 2;
  slab.position.y = 0.12;
  slab.receiveShadow = true;
  group.add(slab);

  // The slab's own thickness, so it sits on the sand rather than in it.
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(PLAZA_RADIUS, PLAZA_RADIUS + 0.1, 0.24, 128, 1, true),
    m.cream,
  );
  rim.position.y = 0.02;
  rim.receiveShadow = true;
  group.add(rim);

  // A low plywood curb to sit on, open where the path comes in from the gate.
  const profile = [
    new THREE.Vector2(PLAZA_RADIUS + 0.12, 0),
    new THREE.Vector2(PLAZA_RADIUS + 0.62, 0),
    new THREE.Vector2(PLAZA_RADIUS + 0.66, 0.34),
    new THREE.Vector2(PLAZA_RADIUS + 0.5, 0.42),
    new THREE.Vector2(PLAZA_RADIUS + 0.16, 0.42),
    new THREE.Vector2(PLAZA_RADIUS + 0.12, 0.3),
  ];
  const gateHalf = THREE.MathUtils.degToRad(11);
  const curb = new THREE.Mesh(
    new THREE.LatheGeometry(profile, 160, Math.PI / 2 + gateHalf, Math.PI * 2 - gateHalf * 2),
    m.plywood,
  );
  curb.castShadow = true;
  curb.receiveShadow = true;
  group.add(curb);

  // The path in from the gate, in the same rubber as the plaza.
  const path = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 12), m.clayRubber);
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.06, PLAZA_RADIUS + 5);
  path.receiveShadow = true;
  group.add(path);

  scene.add(group);
  return group;
}

/* ---- the paint ---------------------------------------------------------- */

function paintPlaza(canvas: HTMLCanvasElement, size: number) {
  const g = canvas.getContext("2d")!;
  const k = size / (PLAZA_RADIUS * 2);
  /** World metres → canvas pixels. Canvas x is world x, canvas y is world z. */
  const px = (x: number) => (x + PLAZA_RADIUS) * k;
  const py = (z: number) => (z + PLAZA_RADIUS) * k;
  const u = (metres: number) => metres * k;

  g.fillStyle = HEX.rubber;
  g.fillRect(0, 0, size, size);

  /** A smooth painted band through a run of points. */
  const band = (points: Point[], width: number, color: string, alpha = 1, edge?: string) => {
    if (edge) band(points, width + 0.7, edge, alpha);
    g.save();
    g.globalAlpha = alpha;
    g.strokeStyle = color;
    g.lineWidth = u(width);
    g.lineCap = "round";
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(px(points[0][0]), py(points[0][1]));
    for (let i = 1; i < points.length - 1; i++) {
      const mx = (points[i][0] + points[i + 1][0]) / 2;
      const mz = (points[i][1] + points[i + 1][1]) / 2;
      g.quadraticCurveTo(px(points[i][0]), py(points[i][1]), px(mx), py(mz));
    }
    const last = points[points.length - 1];
    g.lineTo(px(last[0]), py(last[1]));
    g.stroke();
    g.restore();
  };

  const pad = (x: number, z: number, rx: number, rz: number, color: string, alpha = 1, edge?: string) => {
    if (edge) pad(x, z, rx + 0.34, rz + 0.34, edge, alpha);
    g.save();
    g.globalAlpha = alpha;
    g.fillStyle = color;
    g.beginPath();
    g.ellipse(px(x), py(z), u(rx), u(rz), 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };

  /** Text lying on the floor, upright for a camera at `yaw` (radians). */
  const floorText = (
    text: string,
    x: number,
    z: number,
    sizeM: number,
    color: string,
    yaw: number,
    opts: { alpha?: number; italic?: boolean; track?: number; align?: CanvasTextAlign } = {},
  ) => {
    g.save();
    g.globalAlpha = opts.alpha ?? 1;
    g.translate(px(x), py(z));
    g.rotate(-yaw);
    g.fillStyle = color;
    g.font = `${opts.italic ? "italic " : ""}${opts.italic ? 400 : 450} ${u(sizeM)}px ${serif()}`;
    g.textAlign = opts.align ?? "center";
    g.textBaseline = "middle";
    if (opts.track) g.letterSpacing = `${u(opts.track)}px`;
    g.fillText(text, 0, 0);
    g.letterSpacing = "0px";
    g.restore();
  };

  const labelText = (text: string, x: number, z: number, sizeM: number, yaw: number, alpha = 0.5) => {
    g.save();
    g.globalAlpha = alpha;
    g.translate(px(x), py(z));
    g.rotate(-yaw);
    g.fillStyle = HEX.kola;
    g.font = `500 ${u(sizeM)}px ${mono()}`;
    g.letterSpacing = `${u(sizeM * 0.16)}px`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text.toUpperCase(), 0, 0);
    g.letterSpacing = "0px";
    g.restore();
  };

  /* Station grounds ------------------------------------------------------- */

  // Interpret: one long band from the Hausa dish to the French one, so the
  // whisper between them has a visible line on the floor.
  band(
    [
      [-21.6, 5.5],
      [-17, 4.8],
      [-13, 4.8],
      [-9.4, 5.5],
    ],
    5.4,
    HEX.sahelBand,
    1,
    "#e9b189",
  );
  pad(-20.5, 5.5, 3.2, 3.2, HEX.sahelBand, 1, "#e9b189");
  pad(-10.5, 5.5, 3.2, 3.2, HEX.sahelBand, 1, "#e9b189");

  // Transcribe: a dry-clay strip running out under the tunnel to the tray.
  band(
    [
      [2.6, -6.4],
      [6, -9],
      [10, -12],
      [16.4, -16.4],
    ],
    5.2,
    HEX.clayBand,
    1,
    "#ddbe8c",
  );
  pad(15.6, -15.8, 3, 2.4, HEX.clayBand, 1, "#ddbe8c");

  // Voice: a warm pale field holding the slate and the horn together.
  band(
    [
      [9, 4],
      [13, 5.6],
      [18.2, 6.9],
    ],
    5,
    "#f2dcbb",
    1,
    "#e3c69f",
  );
  pad(17.5, 6.5, 3.6, 3.6, "#f2dcbb", 1, "#e3c69f");
  pad(10.5, 5, 3, 2.6, "#f2dcbb", 1, "#e3c69f");

  // Agent: sage, the colour of the mound it climbs onto.
  band(
    [
      [-5, -4.6],
      [-9, -8],
      [-12.6, -11],
    ],
    4.4,
    HEX.sage,
    1,
    "#b5c1b0",
  );
  pad(-13.5, -12.8, 6, 5.8, HEX.sage, 1, "#b5c1b0");

  /* Paths from the Blossom out to each station ---------------------------- */

  const walk = (points: Point[]) => {
    band(points, 2.6, HEX.surface2, 0.85);
    g.save();
    g.globalAlpha = 0.5;
    g.setLineDash([u(0.5), u(0.55)]);
    g.strokeStyle = HEX.paper;
    g.lineWidth = u(0.14);
    g.lineCap = "butt";
    g.beginPath();
    g.moveTo(px(points[0][0]), py(points[0][1]));
    for (let i = 1; i < points.length - 1; i++) {
      const mx = (points[i][0] + points[i + 1][0]) / 2;
      const mz = (points[i][1] + points[i + 1][1]) / 2;
      g.quadraticCurveTo(px(points[i][0]), py(points[i][1]), px(mx), py(mz));
    }
    const last = points[points.length - 1];
    g.lineTo(px(last[0]), py(last[1]));
    g.stroke();
    g.setLineDash([]);
    g.restore();
  };

  walk([
    [-3.2, 2],
    [-6.4, 3.8],
    [-9.2, 5],
  ]);
  walk([
    [1.9, -2.9],
    [3, -5.4],
    [3.6, -7.4],
  ]);
  walk([
    [3.2, 1.6],
    [6.6, 3.4],
    [9.4, 4.6],
  ]);
  walk([
    [-3.2, -2.2],
    [-6.6, -5.6],
    [-10.4, -9],
  ]);
  walk([
    [0, 25],
    [0, 18],
    [0, 8],
    [0, 3.6],
  ]);

  /* The Blossom's own circle ---------------------------------------------- */

  pad(0, 0, 4.6, 4.6, HEX.surface2);
  g.save();
  g.globalAlpha = 0.28;
  g.strokeStyle = HEX.kola;
  g.lineWidth = u(0.1);
  [3.5, 5.4].forEach((r) => {
    g.beginPath();
    g.arc(px(0), py(0), u(r), 0, Math.PI * 2);
    g.stroke();
  });
  g.restore();

  /* Rim tagline ------------------------------------------------------------ */

  ringText(
    g,
    "NAMU PLAYGROUND · SPEAK · LISTEN · WRITE · TALK · ",
    px(0),
    py(0),
    u(23.4),
    `500 ${u(0.9)}px ${mono()}`,
    HEX.kola,
    0.52,
  );
  g.save();
  g.globalAlpha = 0.3;
  g.strokeStyle = HEX.kola;
  g.lineWidth = u(0.08);
  [22.3, 24.5].forEach((r) => {
    g.beginPath();
    g.arc(px(0), py(0), u(r), 0, Math.PI * 2);
    g.stroke();
  });
  g.restore();

  /* Station marks ---------------------------------------------------------- */

  // Interpret: the two languages, facing each other across the whisper line,
  // with arrows showing that it runs both ways.
  floorText("HA", -20.5, 8.9, 2.9, HEX.kola, VIEW_YAW.interpret, { alpha: 0.62 });
  floorText("FR", -10.5, 8.9, 2.9, HEX.kola, VIEW_YAW.interpret, { alpha: 0.62 });
  arrow(g, px(-18.4), py(4.1), px(-12.6), py(4.1), u(0.8), HEX.kola, 0.48);
  arrow(g, px(-12.6), py(6.9), px(-18.4), py(6.9), u(0.8), HEX.kola, 0.48);

  // Transcribe: a voice becoming letters, painted along the strip.
  paintWave(g, px, py, u, [3.4, -7.2], [10.4, -12.4], 12);
  floorText("sannu", 16.6, -17.8, 1.5, HEX.kola, VIEW_YAW.transcribe, {
    alpha: 0.4,
    italic: true,
  });

  // Voice: rings leaving the horn's mouth.
  g.save();
  g.globalAlpha = 0.3;
  g.strokeStyle = HEX.kola;
  g.lineWidth = u(0.13);
  for (let i = 1; i <= 4; i++) {
    g.beginPath();
    g.arc(px(17.5), py(6.5), u(2.6 + i * 1.5), Math.PI * 0.62, Math.PI * 1.32);
    g.stroke();
  }
  g.restore();

  // Agent: the line that runs under the mound from one tube to the other.
  g.save();
  g.globalAlpha = 0.45;
  g.setLineDash([u(0.42), u(0.42)]);
  g.strokeStyle = HEX.forestSoft;
  g.lineWidth = u(0.16);
  g.beginPath();
  g.moveTo(px(-17.4), py(-9.8));
  g.quadraticCurveTo(px(-13.5), py(-5.6), px(-9.6), py(-9.6));
  g.stroke();
  g.setLineDash([]);
  g.restore();

  /* Numbers and names, as a playground paints its games -------------------- */

  const marks: Array<[string, string, number, number, number]> = [
    ["01", "WHISPER DISHES", -15.5, 11.6, VIEW_YAW.interpret],
    ["02", "LISTENING TUNNEL", 5.2, -12.4, VIEW_YAW.transcribe],
    ["03", "SPEAKING HORN", 13.6, 9.2, VIEW_YAW.voice],
    ["04", "TALK TUBES", -18.6, -15.4, VIEW_YAW.agent],
  ];
  for (const [n, name, x, z, yaw] of marks) {
    floorText(n, x, z, 3.4, HEX.kola, yaw, { alpha: 0.5 });
    labelText(name, x + Math.sin(yaw) * 2.8, z + Math.cos(yaw) * 2.8, 0.68, yaw, 0.48);
  }

  /* Hopscotch by the gate, counted in Hausa -------------------------------- */

  const counts = ["ɗaya", "biyu", "uku", "huɗu", "biyar", "shida"];
  counts.forEach((word, i) => {
    const z = 15.4 - i * 1.9;
    const x = -6.4 + (i % 2 === 0 ? 0 : 0.95);
    g.save();
    g.globalAlpha = 0.42;
    g.strokeStyle = HEX.kola;
    g.lineWidth = u(0.12);
    g.strokeRect(px(x - 0.85), py(z - 0.85), u(1.7), u(1.7));
    g.restore();
    floorText(word, x, z, 0.7, HEX.kola, 0, { alpha: 0.5, italic: true });
  });

  /* Dot fields, and the granules of the rubber itself ---------------------- */

  dotField(g, px, py, u, -3.5, 14.5, 7, 4, 1.5, 0.2);
  dotField(g, px, py, u, 6.5, -2.5, 6, 6, 1.6, 0.16);
  dotField(g, px, py, u, -1.5, -14.5, 6, 4, 1.6, 0.16);

  speckle(g, 0, 0, size, size, 0.11, ["#e9dcc4", "#f6eeddff", "#dfceb2"], 17);

  // A little wear where the paths meet the Blossom.
  const r = rng(29);
  g.save();
  for (let i = 0; i < 240; i++) {
    const a = r() * Math.PI * 2;
    const d = 3 + r() * 3.4;
    g.globalAlpha = 0.03 + r() * 0.05;
    g.fillStyle = HEX.rubberDeep;
    g.beginPath();
    g.ellipse(px(Math.cos(a) * d), py(Math.sin(a) * d), u(0.3 + r()), u(0.2 + r() * 0.6), a, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

/** Letters set around a circle, upright for a reader outside the ring. */
function ringText(
  g: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  font: string,
  color: string,
  alpha: number,
) {
  g.save();
  g.globalAlpha = alpha;
  g.fillStyle = color;
  g.font = font;
  g.textAlign = "center";
  g.textBaseline = "middle";

  const widths = [...text].map((ch) => g.measureText(ch).width);
  const unit = widths.reduce((a, b) => a + b, 0);
  const repeats = Math.max(1, Math.round((Math.PI * 2 * radius) / unit));
  const scale = (Math.PI * 2 * radius) / (unit * repeats);

  // Anticlockwise, so the letters run left to right for a reader standing on
  // the near side of the ring — the way a stencil is laid on a real floor.
  let angle = -Math.PI / 2;
  for (let n = 0; n < repeats; n++) {
    [...text].forEach((ch, i) => {
      const step = (widths[i] * scale) / radius;
      const mid = angle - step / 2;
      g.save();
      g.translate(cx + Math.cos(mid) * radius, cy + Math.sin(mid) * radius);
      g.rotate(mid - Math.PI / 2);
      g.fillText(ch, 0, 0);
      g.restore();
      angle -= step;
    });
  }
  g.restore();
}

/** A painted arrow, for the two-way line between the dishes. */
function arrow(
  g: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  head: number,
  color: string,
  alpha: number,
) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  g.save();
  g.globalAlpha = alpha;
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = head * 0.26;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2 - Math.cos(a) * head, y2 - Math.sin(a) * head);
  g.stroke();
  g.translate(x2, y2);
  g.rotate(a);
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(-head, head * 0.52);
  g.lineTo(-head, -head * 0.52);
  g.closePath();
  g.fill();
  g.restore();
}

/** Waveform bars painted along the transcribe strip. */
function paintWave(
  g: CanvasRenderingContext2D,
  px: (x: number) => number,
  py: (z: number) => number,
  u: (m: number) => number,
  from: Point,
  to: Point,
  count: number,
) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
  g.save();
  g.globalAlpha = 0.34;
  g.fillStyle = HEX.kola;
  g.translate(px(from[0]), py(from[1]));
  g.rotate(a);
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const h = (0.35 + Math.abs(Math.sin(i * 1.7)) * 1.5) * (1 - t * 0.7);
    const x = u(t * length);
    g.fillRect(x - u(0.12), -u(h / 2), u(0.24), u(h));
  }
  g.restore();
}

function dotField(
  g: CanvasRenderingContext2D,
  px: (x: number) => number,
  py: (z: number) => number,
  u: (m: number) => number,
  x: number,
  z: number,
  cols: number,
  rows: number,
  step: number,
  alpha: number,
) {
  g.save();
  g.globalAlpha = alpha;
  g.fillStyle = HEX.kola;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const dx = x + (i - (cols - 1) / 2) * step;
      const dz = z + (j - (rows - 1) / 2) * step;
      g.beginPath();
      g.arc(px(dx), py(dz), u(0.16), 0, Math.PI * 2);
      g.fill();
    }
  }
  g.restore();
}

/** The sand apron the plaza sits on, and the track worn in from the gate. */
export function createApron(scene: THREE.Scene) {
  const apron = new THREE.Mesh(
    new THREE.RingGeometry(PLAZA_RADIUS + 0.6, PLAZA_RADIUS + 9, 96, 1),
    new THREE.MeshStandardMaterial({ color: HEX.sand, roughness: 1 }),
  );
  apron.rotation.x = -Math.PI / 2;
  apron.position.y = 0.01;
  apron.receiveShadow = true;
  scene.add(apron);
  return apron;
}
