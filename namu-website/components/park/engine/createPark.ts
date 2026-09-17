import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { createBlossom } from "./blossom";
import { createCameraRig, type Frame } from "./cameraRig";
import { createDust, createHills, createLights, createSky, createTrees } from "./environment";
import { createApron, createGround } from "./ground";
import {
  LABEL_ANCHORS,
  STATION_ORDER,
  VIEWS,
  type Activity,
  type Station,
  type StationId,
  type StationState,
} from "./layout";
import { createListeningTunnel } from "./listeningTunnel";
import { createMaterials } from "./materials";
import { createPeople } from "./people";
import { createProps } from "./props";
import { createSpeakingHorn } from "./speakingHorn";
import { createTalkTubes } from "./talkTubes";
import { fontsReady } from "./textures";
import { createWhisperDishes } from "./whisperDishes";

export type ParkCopy = {
  interpret: { title: string; sub: string; ha: string; fr: string; hint: string };
  transcribe: { title: string; sub: string };
  voice: { title: string; sub: string; hint: string };
  agent: { title: string; sub: string; ask: string; answer: string };
};

export type ParkOptions = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  copy: ParkCopy;
  reducedMotion: boolean;
  /** Label elements the engine keeps pinned over the park, by station. */
  labels: Partial<Record<StationId, HTMLElement | null>>;
  /** The live microphone, 0–1, read once a frame. */
  getLevel: () => number;
  onHover: (id: StationId | null) => void;
  onPick: (id: StationId | null) => void;
  onProgress: (fraction: number) => void;
};

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Builds the park and runs it.
 *
 * Everything the page can ask of the park is on the handle this returns:
 * where to look, what a station is doing, and how much of the screen the park
 * still has to compose itself into.
 */
export async function createPark(options: ParkOptions) {
  const { canvas, container, copy } = options;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  const lowPower =
    (typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4) ||
    window.matchMedia("(pointer: coarse)").matches;

  let pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.6 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 600);

  options.onProgress(0.08);
  await fontsReady();

  const m = createMaterials();
  createSky(scene);
  const lights = createLights(scene, lowPower);
  options.onProgress(0.24);
  await nextFrame();

  createHills(scene);
  createApron(scene);
  createGround(scene, m, lowPower ? "low" : "high");
  options.onProgress(0.44);
  await nextFrame();

  createTrees(scene, m);
  const dust = createDust(scene, lowPower ? 140 : 320);
  const props = createProps(scene, m);
  options.onProgress(0.62);
  await nextFrame();

  const blossom = createBlossom(scene, m);
  const stations: Station[] = [
    createWhisperDishes(scene, m, copy.interpret),
    createListeningTunnel(scene, m, copy.transcribe),
    createSpeakingHorn(scene, m, copy.voice),
    createTalkTubes(scene, m, copy.agent),
  ];
  options.onProgress(0.84);
  await nextFrame();

  const people = createPeople(scene, m);

  // The canvas, not the whole root: the panel and the cards sit above it in
  // the DOM, and a press on a button must never also turn the camera or pick
  // whatever sculpture happens to be behind the panel.
  const rig = createCameraRig(camera, canvas, { reducedMotion: options.reducedMotion });
  rig.jumpTo(VIEWS.park);
  rig.setAutoRotate(true);

  /* Post ------------------------------------------------------------------- */

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.34, 0.72, 0.85);
  if (!lowPower) composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const resize = () => {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(width, height);
    rig.resize(width, height);
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(container);

  /* Picking ----------------------------------------------------------------- */

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const targets: Array<{ id: StationId; object: THREE.Object3D }> = [
    { id: "hub", object: blossom.hit },
    ...stations.flatMap((station) => station.hits.map((object) => ({ id: station.id, object }))),
  ];
  const pickables = targets.map((entry) => entry.object);
  const canHover = window.matchMedia("(hover: hover)").matches;

  let hovered: StationId | null = null;
  let selected: StationId | null = null;

  const setHover = (id: StationId | null) => {
    if (id === hovered) return;
    hovered = id;
    blossom.setHover(id === "hub");
    stations.forEach((station) => station.setHover(station.id === id));
    canvas.style.cursor = id ? "pointer" : "";
    options.onHover(id);
  };

  const pickAt = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (!hit) return null;
    return targets.find((entry) => entry.object === hit.object)?.id ?? null;
  };

  let sinceHoverTest = 0;
  let lastMove: PointerEvent | null = null;
  const onMove = (event: PointerEvent) => {
    lastMove = event;
  };
  const onUp = (event: PointerEvent) => {
    if (rig.dragged || event.button !== 0) return;
    const id = pickAt(event);
    if (id) options.onPick(id);
  };
  if (canHover) canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);

  /* The loop ---------------------------------------------------------------- */

  const level = { value: 0, smooth: 0 };
  /** The free rectangle, so a label never drifts under the bar or the sheet. */
  let frame: Frame = { x: 0, y: 0, width: 1, height: 1 };
  const states = new Map<StationId, StationState>();
  const projected = new THREE.Vector3();
  let elapsed = 0;
  let slowFrames = 0;
  let downgraded = lowPower;

  const placeLabels = () => {
    const rect = { width: container.clientWidth, height: container.clientHeight };
    for (const id of ["hub", ...STATION_ORDER] as StationId[]) {
      const element = options.labels[id];
      if (!element) continue;
      projected.copy(LABEL_ANCHORS[id]).project(camera);
      const onscreen =
        projected.z < 1 &&
        projected.x > -1.15 &&
        projected.x < 1.15 &&
        projected.y > -1.15 &&
        projected.y < 1.15;
      element.dataset.onscreen = onscreen ? "true" : "false";
      if (!onscreen) continue;
      const x = THREE.MathUtils.clamp(
        (projected.x * 0.5 + 0.5) * rect.width,
        frame.x + 62,
        frame.x + frame.width - 62,
      );
      const y = THREE.MathUtils.clamp(
        (-projected.y * 0.5 + 0.5) * rect.height,
        frame.y + 16,
        frame.y + frame.height - 16,
      );
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    }
  };

  let previous = performance.now();
  renderer.setAnimationLoop(() => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - previous) / 1000);
    previous = now;
    elapsed += dt;

    // A frame budget that gives way rather than stuttering.
    if (!downgraded) {
      slowFrames = dt > 0.028 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 90) {
        downgraded = true;
        pixelRatio = Math.min(pixelRatio, 1.25);
        renderer.setPixelRatio(pixelRatio);
        composer.setPixelRatio(pixelRatio);
        resize();
      }
    }

    // The microphone drives the stepping stones everywhere in the park, and
    // the rings at whichever station is listening.
    level.value = options.getLevel();
    level.smooth += (level.value - level.smooth) * Math.min(1, dt * 12);
    if (selected) {
      const state = states.get(selected);
      if (state && state.activity === "recording" && state.level !== level.value) {
        const next = { ...state, level: level.value };
        states.set(selected, next);
        stations.find((station) => station.id === selected)?.setState(next);
      }
    }

    if (canHover && lastMove && (sinceHoverTest += dt) > 0.06) {
      sinceHoverTest = 0;
      setHover(pickAt(lastMove));
      lastMove = null;
    }

    rig.update(dt);
    blossom.update(dt, elapsed);
    stations.forEach((station) => station.update(dt, elapsed));
    props.update(dt, elapsed, level.smooth);
    // With reduced motion the park still answers what you do — the rings, the
    // light and the letters — but nobody wanders and no dust drifts.
    if (!options.reducedMotion) {
      people.update(dt, elapsed);
      dust(dt, elapsed);
    }
    placeLabels();

    composer.render();
  });

  return {
    /** Send the camera to a station, or back to the whole park. */
    select(id: StationId | null, fly = true) {
      selected = id;
      const view = VIEWS[id ?? "park"];
      rig.setAutoRotate(id === null);
      if (fly) rig.flyTo(view, id === null ? 1.7 : 1.5);
      else rig.jumpTo(view);
    },

    get selected() {
      return selected;
    },

    /** What the console is doing, so the sculpture can answer. */
    setState(id: StationId, state: StationState) {
      states.set(id, state);
      stations.find((station) => station.id === id)?.setState(state);
    },

    /** Light a sculpture up from outside the canvas — a chip, say. */
    hover(id: StationId | null) {
      setHover(id);
    },

    setFrame(next: Frame, immediate = false) {
      frame = next;
      rig.setFrame(next, immediate);
    },

    setSun(intensity: number) {
      lights.sun.intensity = intensity;
    },

    dispose() {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      if (canHover) canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      rig.dispose();
      bloom.dispose();
      composer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const material = mesh.material;
          if (Array.isArray(material)) material.forEach((one) => one.dispose());
          else material?.dispose();
        }
      });
      renderer.dispose();
    },
  };
}

export type ParkHandle = Awaited<ReturnType<typeof createPark>>;
export type { Activity, StationId, StationState };
