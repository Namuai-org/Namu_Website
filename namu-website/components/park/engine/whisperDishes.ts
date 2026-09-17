import * as THREE from "three";
import { MoteStream, PulseRings, arcBetween, damp } from "./fx";
import { SPOTS, VIEW_YAW, type Station, type StationState } from "./layout";
import { hitVolume, type Materials } from "./materials";
import { createPlaque, rod } from "./pieces";

const DISH_RADIUS = 2.1;
/** A short focal length, so the dish is deep enough to read as a dish. */
const FOCUS = 0.72;
const CENTRE_Y = 2.2;
/** Each dish is turned a little toward the path, the way a sign is. */
const TWIST = 0.38;

/**
 * Namu-Interpret, as the whisper dishes every science playground has: two
 * parabolic dishes facing each other across the grass. Here one is Hausa and
 * the other French, and what carries between them is the model. Speak into the
 * ring in front of one, and the far dish answers.
 */
export function createWhisperDishes(
  scene: THREE.Scene,
  m: Materials,
  copy: { title: string; sub: string; ha: string; fr: string; hint: string },
): Station {
  const group = new THREE.Group();

  const ha = buildDish(m, SPOTS.dishHa, SPOTS.dishFr, -TWIST);
  const fr = buildDish(m, SPOTS.dishFr, SPOTS.dishHa, TWIST);
  group.add(ha.group, fr.group);

  group.add(
    createPlaque(m, copy.title, copy.sub, new THREE.Vector3(-15.5, 0, 10.4), VIEW_YAW.interpret),
    // Which language belongs to which dish, on a sign in front of each.
    createPlaque(m, copy.ha, copy.hint, new THREE.Vector3(-20.5, 0, 7.6), VIEW_YAW.interpret, 0.78),
    createPlaque(m, copy.fr, copy.hint, new THREE.Vector3(-10.5, 0, 7.6), VIEW_YAW.interpret, 0.78),
  );

  const rings = {
    ha: new PulseRings(group, { from: 0.4, to: 3.2, life: 2.4 }),
    fr: new PulseRings(group, { from: 0.4, to: 3.2, life: 2.4 }),
  };
  rings.ha.setPose(ha.focus, ha.forward);
  rings.fr.setPose(fr.focus, fr.forward);

  const stream = new MoteStream(group, arcBetween(ha.focus, fr.focus, 0.28), { count: 54 });

  const hits = [
    hitVolume(new THREE.Vector3(4.4, 4.6, 4.4), SPOTS.dishHa.clone().setY(2.2)),
    hitVolume(new THREE.Vector3(4.4, 4.6, 4.4), SPOTS.dishFr.clone().setY(2.2)),
  ];
  hits.forEach((h) => group.add(h));

  scene.add(group);

  let state: StationState = { activity: "idle", level: 0 };
  let hover = 0;
  let hoverTarget = 0;
  let sourceGlow = 0.06;
  let targetGlow = 0.06;
  let sinceRing = 0;
  let answering = 0;

  const sideOf = (variantId?: string) => ((variantId ?? "ha-fr") === "ha-fr" ? ha : fr);
  const otherOf = (variantId?: string) => ((variantId ?? "ha-fr") === "ha-fr" ? fr : ha);

  return {
    id: "interpret",
    group,
    hits,
    setHover(on) {
      hoverTarget = on ? 1 : 0;
    },
    setState(next) {
      const changed = next.activity !== state.activity || next.variantId !== state.variantId;
      state = next;
      const source = sideOf(next.variantId);
      const target = otherOf(next.variantId);

      if (next.activity === "running") {
        stream.setCurve(arcBetween(source.focus, target.focus, 0.28));
        stream.play();
      } else {
        stream.stop();
      }
      // An answer lands on the far dish, whether it is the model's or the
      // note saying the next version is on its way.
      if (changed && (next.activity === "done" || next.activity === "soon")) answering = 3.4;
      if (next.activity === "recording" || next.activity === "running") answering = 0;
    },
    update(dt, t) {
      hover = damp(hover, hoverTarget, 6, dt);
      const source = sideOf(state.variantId);
      const target = otherOf(state.variantId);

      const breath = 0.05 + Math.sin(t * 1.1) * 0.03;
      const wantSource =
        state.activity === "recording"
          ? 0.5 + state.level * 1.6
          : state.activity === "running"
            ? 0.4
            : breath + hover * 0.4;
      const wantTarget = answering > 0 ? 0.9 : hover * 0.4 + breath * 0.6;

      sourceGlow = damp(sourceGlow, wantSource, 8, dt);
      targetGlow = damp(targetGlow, wantTarget, 8, dt);
      source.setGlow(sourceGlow);
      target.setGlow(targetGlow);

      sinceRing += dt;
      if (state.activity === "recording" && sinceRing > 0.34) {
        sinceRing = 0;
        rings[source === ha ? "ha" : "fr"].emit(0.3 + state.level * 1.2);
      }
      if (answering > 0) {
        answering -= dt;
        if (sinceRing > 0.5) {
          sinceRing = 0;
          rings[target === ha ? "ha" : "fr"].emit(0.85);
        }
      }

      rings.ha.update(dt);
      rings.fr.update(dt);
      stream.update(dt);
    },
  };
}

/** One dish on its post, aimed at the other one. */
function buildDish(m: Materials, at: THREE.Vector3, towards: THREE.Vector3, twist: number) {
  const group = new THREE.Group();
  group.position.copy(at);
  const aim = towards.clone().sub(at).setY(0).normalize();
  group.rotation.y = Math.atan2(aim.x, aim.z) + twist;

  // A parabola, so a voice at the focus leaves the dish as a flat beam.
  const profile: THREE.Vector2[] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const r = (i / steps) * DISH_RADIUS;
    profile.push(new THREE.Vector2(r, (r * r) / (4 * FOCUS)));
  }
  const depth = (DISH_RADIUS * DISH_RADIUS) / (4 * FOCUS);
  profile.push(new THREE.Vector2(DISH_RADIUS + 0.07, depth + 0.03));

  // The dish is tilted a touch downward, toward the height of a face.
  const TILT = 0.06;
  const lathe = new THREE.LatheGeometry(profile, 64);

  const inner = new THREE.Mesh(lathe, m.clayInner);
  inner.rotation.x = Math.PI / 2 + TILT;
  inner.position.y = CENTRE_Y;
  inner.castShadow = true;
  inner.receiveShadow = true;
  group.add(inner);

  const shell = new THREE.Mesh(
    new THREE.LatheGeometry(
      profile.map((p) => new THREE.Vector2(p.x * 1.03 + 0.02, p.y - 0.1)),
      64,
    ),
    m.plywood,
  );
  shell.rotation.x = Math.PI / 2 + TILT;
  shell.position.y = CENTRE_Y;
  shell.castShadow = true;
  group.add(shell);

  /** A point on the dish's axis, `along` metres out from the vertex. */
  const onAxis = (along: number) =>
    new THREE.Vector3(0, CENTRE_Y - Math.sin(TILT) * along, Math.cos(TILT) * along);

  const rimMaterial = m.accent();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(DISH_RADIUS + 0.08, 0.09, 12, 72), rimMaterial);
  rim.position.copy(onAxis(depth));
  rim.rotation.x = TILT;
  group.add(rim);

  // The ring you put your mouth to, exactly at the dish's focus.
  const focusPoint = onAxis(FOCUS);
  const focusRing = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.055, 10, 40), rimMaterial);
  focusRing.position.copy(focusPoint);
  focusRing.rotation.x = TILT;
  group.add(focusRing);

  // Two thin arms up from the lower rim, so the ring is held without a bar
  // being drawn across the face of the dish.
  for (const side of [-1, 1]) {
    const from = new THREE.Vector3(
      side * (DISH_RADIUS - 0.15) * 0.62,
      -(DISH_RADIUS - 0.15) * 0.78,
      0,
    ).add(onAxis(depth * 0.9));
    const to = new THREE.Vector3(side * 0.2, -0.28, 0).add(focusPoint);
    group.add(rod(m.plywoodEdge, from, to, 0.03));
  }

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, CENTRE_Y, 14), m.plywood);
  post.position.y = CENTRE_Y / 2;
  post.castShadow = true;
  post.receiveShadow = true;
  group.add(post);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.18, 28), m.cream);
  base.position.y = 0.09;
  base.receiveShadow = true;
  group.add(base);

  const focus = focusPoint.clone().applyEuler(group.rotation).add(at);
  // Sound leaves along the dish's own axis, wherever the dish is pointed.
  const forward = new THREE.Vector3(Math.sin(group.rotation.y), 0.02, Math.cos(group.rotation.y)).normalize();

  return {
    group,
    focus,
    forward,
    setGlow(value: number) {
      rimMaterial.emissiveIntensity = value;
    },
  };
}
