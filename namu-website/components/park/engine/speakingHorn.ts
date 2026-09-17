import * as THREE from "three";
import { MoteStream, PulseRings, damp } from "./fx";
import { SPOTS, VIEW_YAW, type Station, type StationState } from "./layout";
import { hitVolume, type Materials } from "./materials";
import { createPlaque, rod } from "./pieces";
import { canvasTexture, drawSlate } from "./textures";

const HORN_LENGTH = 3.6;
const BELL_RADIUS = 2.1;
const THROAT_RADIUS = 0.16;
const AXIS_Y = 2.3;
/** Tipped up, the way a gramophone horn is, so you can see into the bell. */
const TILT = 0.4;

/**
 * Tafiya, as a slate and a horn.
 *
 * You write on the board in chalk, the words run along the orange tube, and the
 * horn at the end of it says them aloud over the park. Text going in, speech
 * coming out — the tunnel's station read backwards, and built to look it.
 */
export function createSpeakingHorn(
  scene: THREE.Scene,
  m: Materials,
  copy: { title: string; sub: string; hint: string },
): Station {
  const group = new THREE.Group();

  /* The horn ---------------------------------------------------------------- */

  const horn = new THREE.Group();
  horn.position.copy(SPOTS.horn);
  horn.rotation.y = VIEW_YAW.voice - Math.PI / 4;
  group.add(horn);

  const toWorld = (v: THREE.Vector3) => v.clone().applyEuler(horn.rotation).add(SPOTS.horn);

  // A narrow throat that holds its width, then opens fast into the bell —
  // the shape that makes a horn read as a horn from across the park.
  const profile: THREE.Vector2[] = [];
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s = t * HORN_LENGTH;
    profile.push(
      new THREE.Vector2(THROAT_RADIUS + (BELL_RADIUS - THROAT_RADIUS) * Math.pow(t, 2.6), s),
    );
  }
  // A lip that turns back on itself at the mouth.
  profile.push(new THREE.Vector2(BELL_RADIUS + 0.1, HORN_LENGTH + 0.12));

  const bore = new THREE.Mesh(new THREE.LatheGeometry(profile, 72), m.clayInner);
  bore.rotation.x = Math.PI / 2 - TILT;
  bore.position.y = AXIS_Y;
  bore.castShadow = true;
  bore.receiveShadow = true;
  horn.add(bore);

  const shell = new THREE.Mesh(
    new THREE.LatheGeometry(
      profile.map((p) => new THREE.Vector2(p.x * 1.04 + 0.03, p.y - 0.06)),
      72,
    ),
    m.plywood,
  );
  shell.rotation.x = Math.PI / 2 - TILT;
  shell.position.y = AXIS_Y;
  shell.castShadow = true;
  horn.add(shell);

  /** A point on the horn's axis, `along` metres from the throat. */
  const onAxis = (along: number) =>
    new THREE.Vector3(0, AXIS_Y + Math.sin(TILT) * along, Math.cos(TILT) * along);

  const rimMaterial = m.accent();
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(BELL_RADIUS + 0.1, 0.11, 12, 80),
    rimMaterial,
  );
  rim.position.copy(onAxis(HORN_LENGTH));
  rim.rotation.x = -TILT;
  horn.add(rim);

  // The neck: the throat bends down into a plywood box on the ground.
  const neck = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        onAxis(0.04),
        new THREE.Vector3(0, AXIS_Y - 0.3, -0.35),
        new THREE.Vector3(0, AXIS_Y - 0.9, -1.15),
        new THREE.Vector3(0, 1.1, -1.55),
        new THREE.Vector3(0, 0.8, -1.7),
      ]),
      32,
      0.26,
      16,
    ),
    m.plywood,
  );
  neck.castShadow = true;
  horn.add(neck);

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.9, 1.5), m.plywood);
  base.position.set(0, 0.45, -1.7);
  base.castShadow = true;
  base.receiveShadow = true;
  horn.add(base);

  // Two struts holding the bell up, as a bandstand horn would have.
  for (const side of [-1, 1]) {
    horn.add(
      rod(
        m.plywoodEdge,
        new THREE.Vector3(side * 1.25, 0.12, -0.5),
        new THREE.Vector3(side * 1.05, 0, 0).add(onAxis(HORN_LENGTH * 0.78)),
        0.085,
      ),
    );
  }

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 3.05, 0.16, 40), m.cream);
  pad.position.y = 0.08;
  pad.receiveShadow = true;
  horn.add(pad);

  const bellMouth = toWorld(onAxis(HORN_LENGTH + 0.2));
  const bellDirection = toWorld(onAxis(HORN_LENGTH + 1))
    .sub(toWorld(onAxis(HORN_LENGTH)))
    .normalize();

  /* The slate --------------------------------------------------------------- */

  const easel = new THREE.Group();
  easel.position.copy(SPOTS.slate);
  easel.rotation.y = VIEW_YAW.voice;
  group.add(easel);

  const slateCanvas = document.createElement("canvas");
  slateCanvas.width = 1024;
  slateCanvas.height = 640;
  drawSlate(slateCanvas, "", copy.hint);
  const slateTexture = canvasTexture(slateCanvas);
  const slateFace = new THREE.MeshStandardMaterial({ map: slateTexture, roughness: 0.92 });

  const board = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.94, 0.14), [
    m.plywoodEdge,
    m.plywoodEdge,
    m.plywoodEdge,
    m.plywoodEdge,
    slateFace,
    m.plywoodEdge,
  ]);
  board.position.y = 1.85;
  board.rotation.x = -0.1;
  board.castShadow = true;
  board.receiveShadow = true;
  easel.add(board);

  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.42, 2.26, 0.1), m.plywood);
  frame.position.set(0, 1.85, -0.08);
  frame.rotation.x = -0.1;
  frame.castShadow = true;
  easel.add(frame);

  for (const side of [-1, 1]) {
    easel.add(rod(m.plywood, new THREE.Vector3(side * 1.5, 0, -0.5), new THREE.Vector3(side * 1.5, 2.9, 0.1), 0.09));
  }

  const chalkTray = new THREE.Mesh(new THREE.BoxGeometry(3.42, 0.14, 0.34), m.plywood);
  chalkTray.position.set(0, 0.82, 0.16);
  chalkTray.castShadow = true;
  easel.add(chalkTray);

  const chalk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), m.cream);
  chalk.position.set(0.9, 0.93, 0.18);
  chalk.rotation.z = Math.PI / 2;
  easel.add(chalk);

  /* The tube that carries the words ----------------------------------------- */

  const tubeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(10.9, 0.5, 5.7),
    new THREE.Vector3(12.4, 1.15, 6.1),
    new THREE.Vector3(14.1, 0.95, 6.5),
    new THREE.Vector3(15.9, 1.1, 6.6),
    toWorld(new THREE.Vector3(0, 1.1, -1.5)),
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(tubeCurve, 60, 0.2, 16), m.sahelGloss);
  tube.castShadow = true;
  tube.receiveShadow = true;
  group.add(tube);

  // Where the words go: along the tube, up the neck and out of the bell.
  const flightCurve = new THREE.CatmullRomCurve3([
    ...tubeCurve.points,
    toWorld(onAxis(0.4)),
    toWorld(onAxis(HORN_LENGTH * 0.7)),
    bellMouth,
  ]);
  const stream = new MoteStream(group, flightCurve, { count: 60, size: 0.28, speed: 0.34 });

  const rings = new PulseRings(group, { from: 0.9, to: 4.6, life: 2.6 });
  rings.setPose(bellMouth, bellDirection);

  group.add(
    createPlaque(m, copy.title, copy.sub, new THREE.Vector3(12.6, 0, 8.4), VIEW_YAW.voice),
  );

  const hits = [
    hitVolume(new THREE.Vector3(6.4, 6, 6.4), SPOTS.horn.clone().setY(2.8)),
    hitVolume(new THREE.Vector3(4, 3.6, 2), SPOTS.slate.clone().setY(1.8)),
  ];
  hits[1].rotation.y = VIEW_YAW.voice;
  hits.forEach((h) => group.add(h));

  scene.add(group);

  let state: StationState = { activity: "idle", level: 0 };
  let hover = 0;
  let hoverTarget = 0;
  let glow = 0.08;
  let speaking = 0;
  let sinceRing = 0;
  let written = "";
  let dirty = false;
  let sinceDraw = 0;

  return {
    id: "voice",
    group,
    hits,
    setHover(on) {
      hoverTarget = on ? 1 : 0;
    },
    setState(next) {
      const before = state;
      state = next;

      const text = next.text ?? "";
      if (text !== written) {
        written = text;
        dirty = true;
      }
      if (next.activity === "running") stream.play();
      else stream.stop();
      if (
        (next.activity === "done" || next.activity === "soon") &&
        next.activity !== before.activity
      ) {
        speaking = 3.6;
      }
      if (next.activity === "running" || next.activity === "idle") speaking = 0;
    },
    update(dt, t) {
      hover = damp(hover, hoverTarget, 6, dt);

      // The chalk keeps up with the typing, but not at sixty frames a second.
      sinceDraw += dt;
      if (dirty && sinceDraw > 0.1) {
        sinceDraw = 0;
        dirty = false;
        drawSlate(slateCanvas, written, copy.hint);
        slateTexture.needsUpdate = true;
      }

      const want =
        speaking > 0
          ? 0.9
          : state.activity === "running"
            ? 0.45
            : 0.05 + Math.sin(t * 1.1) * 0.03 + hover * 0.4;
      glow = damp(glow, want, 7, dt);
      rimMaterial.emissiveIntensity = glow;

      sinceRing += dt;
      if (speaking > 0) {
        speaking -= dt;
        if (sinceRing > 0.46) {
          sinceRing = 0;
          rings.emit(0.9);
        }
      }

      rings.update(dt);
      stream.update(dt);
    },
  };
}
