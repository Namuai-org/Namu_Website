import * as THREE from "three";
import { HEX } from "./palette";
import { plywoodTexture, rubberTexture } from "./textures";

/**
 * Every surface in the park. Shared where they can be; each station takes its
 * own copy of the accent material so it can glow on its own when hovered or
 * busy without lighting up the rest of the park.
 */
export function createMaterials() {
  const plywoodMap = plywoodTexture();

  const plywood = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: plywoodMap,
    roughness: 0.64,
    metalness: 0,
  });

  const plywoodEdge = new THREE.MeshStandardMaterial({ color: HEX.plywoodDeep, roughness: 0.7 });

  /** Dry clay lining, for the inside of the horn. */
  const clayInner = new THREE.MeshStandardMaterial({
    color: "#f0dfc0",
    roughness: 0.72,
    side: THREE.DoubleSide,
  });

  /** Cream lining, lit correctly whichever side of it you stand on. */
  const creamDouble = new THREE.MeshStandardMaterial({
    color: HEX.paper,
    roughness: 0.78,
    side: THREE.DoubleSide,
  });

  const cream = new THREE.MeshStandardMaterial({ color: HEX.harmattan, roughness: 0.86 });

  const creamInner = new THREE.MeshStandardMaterial({
    color: HEX.paper,
    roughness: 0.9,
    side: THREE.BackSide,
  });

  const clayRubber = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: rubberTexture(HEX.clayBand, ["#e2c396", "#f4e3c6", "#d9b88a"], 9),
    roughness: 0.95,
  });

  const sageRubber = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: rubberTexture(HEX.sage, ["#bcc7b3", "#e0e5d8", "#a9b7a2"], 13),
    roughness: 0.95,
  });

  const sahelGloss = new THREE.MeshPhysicalMaterial({
    color: HEX.sahel,
    roughness: 0.26,
    clearcoat: 0.9,
    clearcoatRoughness: 0.2,
  });

  const forest = new THREE.MeshStandardMaterial({ color: HEX.forestSoft, roughness: 0.62 });
  const kola = new THREE.MeshStandardMaterial({ color: HEX.kola, roughness: 0.55 });
  const ink = new THREE.MeshStandardMaterial({ color: HEX.ink, roughness: 0.5 });

  const led = new THREE.MeshStandardMaterial({
    color: HEX.led,
    emissive: HEX.led,
    emissiveIntensity: 2.6,
    roughness: 0.4,
  });

  const bulb = new THREE.MeshStandardMaterial({
    color: "#fff1dc",
    emissive: "#ffd4a1",
    emissiveIntensity: 3.2,
  });

  const figure = new THREE.MeshStandardMaterial({ color: HEX.figure, roughness: 0.92 });
  const figureWarm = new THREE.MeshStandardMaterial({ color: HEX.figureWarm, roughness: 0.9 });

  const foliage = new THREE.MeshStandardMaterial({ color: "#72866a", roughness: 0.95, flatShading: true });
  const foliageDark = new THREE.MeshStandardMaterial({ color: "#5c7359", roughness: 0.95, flatShading: true });
  const bark = new THREE.MeshStandardMaterial({ color: "#5b3a24", roughness: 0.9 });

  /** A sahel rim that can brighten on its own. */
  const accent = () =>
    new THREE.MeshStandardMaterial({
      color: HEX.sahel,
      emissive: HEX.sahel,
      emissiveIntensity: 0.05,
      roughness: 0.35,
    });

  /** A warm light that can breathe on its own. */
  const glow = (intensity = 2.2) =>
    new THREE.MeshStandardMaterial({
      color: HEX.led,
      emissive: HEX.led,
      emissiveIntensity: intensity,
      roughness: 0.4,
    });

  return {
    plywood,
    plywoodEdge,
    cream,
    creamDouble,
    clayInner,
    creamInner,
    clayRubber,
    sageRubber,
    sahelGloss,
    forest,
    kola,
    ink,
    led,
    bulb,
    figure,
    figureWarm,
    foliage,
    foliageDark,
    bark,
    accent,
    glow,
  };
}

export type Materials = ReturnType<typeof createMaterials>;

/** Cast and receive shadows on every mesh under a node. */
export function shadows(root: THREE.Object3D, cast = true, receive = true) {
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = cast;
      o.receiveShadow = receive;
    }
  });
  return root;
}

/** An invisible, pickable volume that stands in for a whole station. */
export function hitVolume(size: THREE.Vector3, position: THREE.Vector3) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  mesh.position.copy(position);
  return mesh;
}
