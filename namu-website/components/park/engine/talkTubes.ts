import * as THREE from "three";
import { MoteStream, PulseRings, damp } from "./fx";
import { SPOTS, VIEW_YAW, type Station, type StationState } from "./layout";
import { hitVolume, type Materials } from "./materials";
import { HEX } from "./palette";
import { createBench, createPlaque, createStep } from "./pieces";
import { rng } from "./textures";

const MOUND_RADIUS = 4.8;
const MOUND_HEIGHT = 2.3;

/** The sculpted hill, as a height at a distance from its middle. */
export const moundHeight = (d: number) =>
  d >= MOUND_RADIUS ? 0 : MOUND_HEIGHT * Math.pow(Math.cos((d / MOUND_RADIUS) * (Math.PI / 2)), 1.3);

/**
 * Namu-Agent, as the talk tubes buried in every good playground: speak into one
 * and a voice comes back out of the other. The mound between them hides the run
 * of pipe, and the model is what happens in the dark part of the journey.
 */
export function createTalkTubes(
  scene: THREE.Scene,
  m: Materials,
  copy: { title: string; sub: string; ask: string; answer: string },
): Station {
  const group = new THREE.Group();
  const centre = SPOTS.mound;

  /* The mound ---------------------------------------------------------------- */

  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const d = MOUND_RADIUS * (1 - i / 24);
    profile.push(new THREE.Vector2(d, moundHeight(d)));
  }
  const mound = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), m.sageRubber);
  mound.position.copy(centre);
  mound.castShadow = true;
  mound.receiveShadow = true;
  group.add(mound);

  // Climbing holds, the way a sculpted play hill is studded with them.
  const r = rng(41);
  const holdGeometry = new THREE.IcosahedronGeometry(0.16, 1);
  const holdMaterial = new THREE.MeshStandardMaterial({ color: HEX.sahel, roughness: 0.4 });
  const holds = new THREE.InstancedMesh(holdGeometry, holdMaterial, 11);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 11; i++) {
    const a = r() * Math.PI * 2;
    const d = 1.6 + r() * 2.8;
    dummy.position.set(
      centre.x + Math.cos(a) * d,
      moundHeight(d) - 0.03,
      centre.z + Math.sin(a) * d,
    );
    dummy.scale.set(0.8 + r() * 0.5, 0.5, 0.8 + r() * 0.5);
    dummy.rotation.y = r() * Math.PI;
    dummy.updateMatrix();
    holds.setMatrixAt(i, dummy.matrix);
  }
  holds.castShadow = true;
  group.add(holds);

  for (let i = 0; i < 3; i++) {
    group.add(
      createStep(
        m,
        new THREE.Vector3(centre.x + 3.9 - i * 0.6, 0.14 + i * 0.2, centre.z + 3.8 - i * 0.8),
        new THREE.Vector3(1.7, 0.28 + i * 0.4, 0.85),
        -0.7,
      ),
    );
  }

  /* The two tubes ------------------------------------------------------------ */

  const ask = buildTube(m, centre, new THREE.Vector2(1.6, 1.9), VIEW_YAW.agent);
  const answer = buildTube(m, centre, new THREE.Vector2(-2.2, 0.4), VIEW_YAW.agent);
  group.add(ask.group, answer.group);

  // The run of pipe: down under the mound, and up into the other tube.
  const buried = new THREE.CatmullRomCurve3([
    ask.mouth.clone(),
    ask.root.clone(),
    new THREE.Vector3(centre.x + 0.9, -0.5, centre.z + 1.1),
    new THREE.Vector3(centre.x - 1, -0.6, centre.z + 0.6),
    answer.root.clone(),
    answer.mouth.clone(),
  ]);
  const stream = new MoteStream(group, buried, { count: 52, size: 0.26, speed: 0.36 });

  const askRings = new PulseRings(group, { from: 0.3, to: 2.4, life: 2 });
  askRings.setPose(ask.mouth, ask.direction);
  const answerRings = new PulseRings(group, { from: 0.3, to: 2.8, life: 2.2 });
  answerRings.setPose(answer.mouth, answer.direction);

  group.add(
    createPlaque(
      m,
      copy.title,
      copy.sub,
      new THREE.Vector3(centre.x + 1.6, 0, centre.z + 6.6),
      VIEW_YAW.agent,
    ),
    createPlaque(m, copy.ask, "", ask.signAt, VIEW_YAW.agent, 0.62),
    createPlaque(m, copy.answer, "", answer.signAt, VIEW_YAW.agent, 0.62),
    createBench(
      m,
      new THREE.Vector3(centre.x - 3.4, 0, centre.z + 5.4),
      VIEW_YAW.agent + 0.35,
    ),
  );

  const hits = [
    hitVolume(new THREE.Vector3(11, 5.4, 11), centre.clone().setY(1.6)),
  ];
  hits.forEach((h) => group.add(h));

  scene.add(group);

  let state: StationState = { activity: "idle", level: 0 };
  let hover = 0;
  let hoverTarget = 0;
  let askGlow = 0.06;
  let answerGlow = 0.06;
  let sinceRing = 0;
  let answering = 0;

  return {
    id: "agent",
    group,
    hits,
    setHover(on) {
      hoverTarget = on ? 1 : 0;
    },
    setState(next) {
      const before = state;
      state = next;
      if (next.activity === "running") stream.play();
      else stream.stop();
      if (
        (next.activity === "done" || next.activity === "soon") &&
        next.activity !== before.activity
      ) {
        answering = 3.4;
      }
      if (next.activity === "recording" || next.activity === "running") answering = 0;
    },
    update(dt, t) {
      hover = damp(hover, hoverTarget, 6, dt);
      const breath = 0.05 + Math.sin(t * 1.2) * 0.03;

      askGlow = damp(
        askGlow,
        state.activity === "recording" ? 0.5 + state.level * 1.6 : breath + hover * 0.35,
        8,
        dt,
      );
      answerGlow = damp(answerGlow, answering > 0 ? 0.9 : breath * 0.6 + hover * 0.35, 8, dt);
      ask.setGlow(askGlow);
      answer.setGlow(answerGlow);

      sinceRing += dt;
      if (state.activity === "recording" && sinceRing > 0.34) {
        sinceRing = 0;
        askRings.emit(0.3 + state.level * 1.2);
      }
      if (answering > 0) {
        answering -= dt;
        if (sinceRing > 0.48) {
          sinceRing = 0;
          answerRings.emit(0.85);
        }
      }

      askRings.update(dt);
      answerRings.update(dt);
      stream.update(dt);
    },
  };
}

/** A periscope tube rising out of the mound and bending toward you. */
function buildTube(m: Materials, centre: THREE.Vector3, offset: THREE.Vector2, yaw: number) {
  const group = new THREE.Group();
  const base = new THREE.Vector3(centre.x + offset.x, 0, centre.z + offset.y);
  const surface = moundHeight(Math.hypot(offset.x, offset.y));
  const face = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));

  const top = surface + 1.55;
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(base.x, surface - 0.5, base.z),
    new THREE.Vector3(base.x, surface + 0.7, base.z),
    new THREE.Vector3(base.x, top - 0.1, base.z),
    new THREE.Vector3(base.x + face.x * 0.34, top + 0.22, base.z + face.z * 0.34),
    new THREE.Vector3(base.x + face.x * 0.9, top + 0.3, base.z + face.z * 0.9),
  ]);
  const pipe = new THREE.Mesh(new THREE.TubeGeometry(path, 44, 0.26, 18), m.forest);
  pipe.castShadow = true;
  pipe.receiveShadow = true;
  group.add(pipe);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.26, 20), m.forest);
  collar.position.set(base.x, surface + 0.02, base.z);
  collar.castShadow = true;
  group.add(collar);

  // The mouth: a shallow bell, tipped down to the height of a face. A lathe
  // points along its own +y and a disc along its +z, so they are turned by
  // different amounts to end up facing the same way.
  const mouthAt = new THREE.Vector3(base.x + face.x * 1.05, top + 0.32, base.z + face.z * 1.05);
  const mouthTilt = -0.4;
  const mouthDirection = face
    .clone()
    .multiplyScalar(Math.cos(mouthTilt))
    .add(new THREE.Vector3(0, Math.sin(mouthTilt), 0))
    .normalize();
  const orientLathe = (object: THREE.Object3D) => {
    object.rotation.order = "YXZ";
    object.rotation.y = yaw;
    object.rotation.x = Math.PI / 2 + mouthTilt;
  };
  const orientDisc = (object: THREE.Object3D) => {
    object.rotation.order = "YXZ";
    object.rotation.y = yaw;
    object.rotation.x = mouthTilt;
  };

  const bellProfile: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) {
    const s = i / 12;
    bellProfile.push(new THREE.Vector2(0.27 + Math.pow(s, 2.2) * 0.46, s * 0.5));
  }
  const bell = new THREE.Mesh(new THREE.LatheGeometry(bellProfile, 36), m.forest);
  bell.position.copy(mouthAt);
  orientLathe(bell);
  bell.castShadow = true;
  group.add(bell);

  // A throat that narrows away from you, so the mouth has a depth to speak
  // into rather than looking like a hole cut out of the picture.
  const throat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.3, 0.75, 28, 1, true),
    new THREE.MeshStandardMaterial({
      color: "#24392f",
      roughness: 0.85,
      side: THREE.BackSide,
    }),
  );
  throat.position.copy(mouthAt).addScaledVector(mouthDirection, 0.08);
  orientLathe(throat);
  group.add(throat);

  const rimMaterial = m.accent();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.075, 10, 44), rimMaterial);
  rim.position.copy(mouthAt).addScaledVector(mouthDirection, 0.5);
  orientDisc(rim);
  group.add(rim);

  return {
    group,
    root: new THREE.Vector3(base.x, surface + 0.2, base.z),
    mouth: mouthAt.clone().addScaledVector(mouthDirection, 0.75),
    direction: mouthDirection.clone(),
    signAt: new THREE.Vector3(base.x, 0, base.z).addScaledVector(face, 2.8),
    setGlow(value: number) {
      rimMaterial.emissiveIntensity = value;
    },
  };
}
