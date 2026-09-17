import * as THREE from "three";
import { PulseRings, damp } from "./fx";
import { SPOTS, VIEW_YAW, type Station, type StationState } from "./layout";
import { hitVolume, type Materials } from "./materials";
import { HEX } from "./palette";
import { createPlaque } from "./pieces";
import { letterTexture, rubberTexture } from "./textures";

const RIBS = 9;
const MOUTH_RADIUS = 2.65;
const THROAT_RADIUS = 1.5;
const BLOCK = 0.62;
const MAX_LETTERS = 12;
/** What the tray already holds: hello, in Hausa. */
const RESTING = "SANNU";

/**
 * Tatsuniya, as a tunnel you speak into.
 *
 * The ribs narrow from a wide mouth to a throat, the light runs down them with
 * your voice, and at the far end the words arrive as letter blocks dropping
 * into a tray. Speech going in, text coming out, at the size of a building.
 */
export function createListeningTunnel(
  scene: THREE.Scene,
  m: Materials,
  copy: { title: string; sub: string },
): Station {
  const group = new THREE.Group();

  const axis = SPOTS.tunnelEnd.clone().sub(SPOTS.tunnelStart).setY(0);
  const length = axis.length();
  const direction = axis.clone().normalize();
  const yaw = Math.atan2(direction.x, direction.z);

  const tunnel = new THREE.Group();
  tunnel.position.copy(SPOTS.tunnelStart);
  tunnel.rotation.y = yaw;
  group.add(tunnel);

  // The ribs, and the light that runs along them.
  const leds: THREE.MeshStandardMaterial[] = [];
  for (let i = 0; i < RIBS; i++) {
    const t = i / (RIBS - 1);
    const radius = THREE.MathUtils.lerp(MOUTH_RADIUS, THROAT_RADIUS, t * t * 0.9 + t * 0.1);
    const z = 0.5 + t * (length - 1);

    const rib = new THREE.Mesh(ribGeometry(radius), m.plywood);
    rib.position.z = z;
    rib.castShadow = true;
    rib.receiveShadow = true;
    tunnel.add(rib);

    const led = m.glow(0.6);
    leds.push(led);
    const strip = new THREE.Mesh(
      new THREE.TorusGeometry(radius - 0.2, 0.055, 8, 60, Math.PI),
      led,
    );
    strip.position.z = z;
    tunnel.add(strip);

    // A slat of boardwalk between one rib and the next.
    if (i < RIBS - 1) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.5, 0.09, 0.42), m.plywoodEdge);
      slat.position.set(0, 0.06, z + (length - 1) / (RIBS - 1) / 2);
      slat.receiveShadow = true;
      tunnel.add(slat);
    }
  }

  // The mouth: a glowing arch you stand under and speak into.
  const mouthMaterial = m.accent();
  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(MOUTH_RADIUS + 0.3, 0.13, 12, 80, Math.PI),
    mouthMaterial,
  );
  mouth.position.z = -0.25;
  tunnel.add(mouth);

  const flare = new THREE.Mesh(ribGeometry(MOUTH_RADIUS + 0.55, 0.4, 0.5), m.plywood);
  flare.position.z = -0.25;
  flare.castShadow = true;
  tunnel.add(flare);

  // The chute the letters come out of.
  const chute = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.5, 1.2), m.plywood);
  chute.position.set(0, 0.78, length + 0.45);
  chute.castShadow = true;
  chute.receiveShadow = true;
  tunnel.add(chute);

  const lip = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.7), m.plywoodEdge);
  lip.position.set(0, 0.5, length + 1.3);
  lip.rotation.x = 0.36;
  tunnel.add(lip);

  const chuteMouth = new THREE.Vector3(0, 0.62, length + 1.5)
    .applyEuler(tunnel.rotation)
    .add(SPOTS.tunnelStart);

  // The tray the words land in.
  const tray = new THREE.Group();
  tray.position.copy(SPOTS.tray);
  tray.rotation.y = VIEW_YAW.transcribe;
  group.add(tray);

  const sand = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.16, 3.4),
    new THREE.MeshStandardMaterial({
      map: rubberTexture(HEX.sand, ["#dcc199", "#f0dcbc", "#cfb287"], 23),
      roughness: 1,
    }),
  );
  sand.position.y = 0.16;
  sand.receiveShadow = true;
  tray.add(sand);

  for (const [w, d, x, z] of [
    [5.5, 0.24, 0, -1.78],
    [5.5, 0.24, 0, 1.78],
    [0.24, 3.8, -2.63, 0],
    [0.24, 3.8, 2.63, 0],
  ]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(w, 0.42, d), m.plywood);
    side.position.set(x, 0.21, z);
    side.castShadow = true;
    side.receiveShadow = true;
    tray.add(side);
  }

  group.add(
    createPlaque(m, copy.title, copy.sub, new THREE.Vector3(10.6, 0, -7.6), VIEW_YAW.transcribe),
  );

  /* The letter blocks ------------------------------------------------------ */

  const right = new THREE.Vector3(Math.cos(VIEW_YAW.transcribe), 0, -Math.sin(VIEW_YAW.transcribe));
  const back = new THREE.Vector3(-Math.sin(VIEW_YAW.transcribe), 0, -Math.cos(VIEW_YAW.transcribe));

  const blockGeometry = new THREE.BoxGeometry(BLOCK, BLOCK, BLOCK);
  const blocks = Array.from({ length: MAX_LETTERS }, () => {
    const face = new THREE.MeshStandardMaterial({ roughness: 0.8 });
    const mesh = new THREE.Mesh(blockGeometry, [
      m.plywood,
      m.plywood,
      face,
      m.plywoodEdge,
      m.plywood,
      m.plywood,
    ]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.visible = false;
    group.add(mesh);
    return {
      mesh,
      face,
      flying: false,
      t: 0,
      delay: 0,
      from: new THREE.Vector3(),
      to: new THREE.Vector3(),
      spin: new THREE.Vector3(),
    };
  });

  /** Where the nth letter of an n-letter word sits in the tray. */
  const slot = (i: number, count: number) => {
    const perRow = Math.min(count, 7);
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const rows = Math.ceil(count / perRow);
    return SPOTS.tray
      .clone()
      .setY(0.24 + BLOCK / 2)
      .addScaledVector(right, (col - (perRow - 1) / 2) * (BLOCK + 0.1))
      .addScaledVector(back, (row - (rows - 1) / 2) * (BLOCK + 0.3));
  };

  const spell = (raw: string, thrown: boolean) => {
    const letters = [...raw.toUpperCase().replace(/\s+/g, " ").trim()].slice(0, MAX_LETTERS);
    const shown = letters.filter((ch) => ch !== " ");
    blocks.forEach((block, i) => {
      const ch = shown[i];
      if (!ch) {
        block.mesh.visible = false;
        block.flying = false;
        return;
      }
      block.face.map = letterTexture(ch);
      block.face.needsUpdate = true;
      block.mesh.visible = true;
      block.to.copy(slot(i, shown.length));
      if (thrown) {
        block.flying = true;
        block.t = 0;
        block.delay = i * 0.16;
        block.from.copy(chuteMouth);
        block.spin.set(
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 9,
        );
        block.mesh.position.copy(chuteMouth);
      } else {
        block.flying = false;
        block.mesh.position.copy(block.to);
        block.mesh.rotation.set(0, VIEW_YAW.transcribe, 0);
      }
    });
  };

  spell(RESTING, false);

  const rings = new PulseRings(group, { from: 0.5, to: 3.6, life: 2.4 });
  rings.setPose(
    new THREE.Vector3(0, 1.7, -1.6).applyEuler(tunnel.rotation).add(SPOTS.tunnelStart),
    direction,
  );

  const hits = [
    hitVolume(
      new THREE.Vector3(6, 5, length + 3),
      SPOTS.tunnelStart.clone().addScaledVector(direction, length / 2).setY(2.2),
    ),
  ];
  hits[0].rotation.y = yaw;
  hits.forEach((h) => group.add(h));

  scene.add(group);

  let state: StationState = { activity: "idle", level: 0 };
  let hover = 0;
  let hoverTarget = 0;
  let chase = 0;
  let glow = 0.1;
  let sinceRing = 0;
  let spoken = "";

  return {
    id: "transcribe",
    group,
    hits,
    setHover(on) {
      hoverTarget = on ? 1 : 0;
    },
    setState(next) {
      const before = state;
      state = next;

      // Words arrive as blocks: the transcript when there is one, and the
      // park's own name while the next version is still being built.
      const word =
        next.activity === "done" ? (next.text ?? "").trim() : next.activity === "soon" ? "NAMU" : "";
      if (word && word !== spoken) {
        spoken = word;
        spell(word, true);
      }
      if (next.activity === "recording" && before.activity !== "recording") {
        spoken = "";
      }
    },
    update(dt) {
      hover = damp(hover, hoverTarget, 6, dt);

      const running = state.activity === "running";
      const recording = state.activity === "recording";
      chase += dt * (recording ? 1.1 + state.level * 2.4 : running ? 2.6 : 0.34);

      const amplitude = recording ? 1.4 + state.level * 3 : running ? 2.2 : 0.5 + hover * 0.8;
      leds.forEach((led, i) => {
        const phase = (chase - i * 0.11) % 1;
        const pulse = Math.exp(-((phase + 1) % 1) * 4.2);
        led.emissiveIntensity = 0.28 + amplitude * pulse;
      });

      glow = damp(glow, recording ? 0.6 + state.level : hover * 0.4 + 0.08, 7, dt);
      mouthMaterial.emissiveIntensity = glow;

      sinceRing += dt;
      if (recording && sinceRing > 0.36) {
        sinceRing = 0;
        rings.emit(0.3 + state.level * 1.2);
      }
      rings.update(dt);

      for (const block of blocks) {
        if (!block.flying) continue;
        if (block.delay > 0) {
          block.delay -= dt;
          continue;
        }
        block.t = Math.min(1, block.t + dt * 1.15);
        const e = block.t;
        block.mesh.position.lerpVectors(block.from, block.to, e);
        // A throw, and a small bounce as it lands.
        block.mesh.position.y += Math.sin(e * Math.PI) * 1.9 - Math.abs(Math.sin(e * Math.PI * 3)) * (1 - e) * 0.3;
        if (e < 0.85) {
          block.mesh.rotation.x += block.spin.x * dt;
          block.mesh.rotation.y += block.spin.y * dt;
          block.mesh.rotation.z += block.spin.z * dt;
        } else {
          // Settle face up, turned to be read from where you are standing.
          block.mesh.rotation.x = damp(block.mesh.rotation.x, 0, 12, dt);
          block.mesh.rotation.z = damp(block.mesh.rotation.z, 0, 12, dt);
          block.mesh.rotation.y = damp(
            block.mesh.rotation.y,
            Math.round(block.mesh.rotation.y / (Math.PI * 2)) * Math.PI * 2 + VIEW_YAW.transcribe,
            12,
            dt,
          );
        }
        if (block.t >= 1 && Math.abs(block.mesh.rotation.x) < 0.01) block.flying = false;
      }
    },
  };
}

/** A plywood arch rib: half a ring, cut flat. */
function ribGeometry(radius: number, band = 0.26, depth = 0.34) {
  const outer = radius + band / 2;
  const inner = radius - band / 2;
  const shape = new THREE.Shape();
  shape.moveTo(outer, 0);
  shape.absarc(0, 0, outer, 0, Math.PI, false);
  shape.lineTo(-inner, 0);
  shape.absarc(0, 0, inner, Math.PI, 0, true);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 30,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}
