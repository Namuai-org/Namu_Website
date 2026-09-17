import * as THREE from "three";
import { damp } from "./fx";
import { PLAZA_RADIUS, SPOTS } from "./layout";
import type { Materials } from "./materials";
import { createBench, createLamp, createPlanter } from "./pieces";
import { gateSignTexture } from "./textures";

/**
 * Everything in the park that is not a station: the gate you come in through,
 * the lamps coming on, the planters, and the row of stepping stones that stands
 * up in the shape of whatever you are saying into the microphone.
 */
export function createProps(scene: THREE.Scene, m: Materials) {
  const group = new THREE.Group();

  /* The gate ---------------------------------------------------------------- */

  const gate = new THREE.Group();
  gate.position.copy(SPOTS.gate).setZ(PLAZA_RADIUS + 2.6);
  group.add(gate);

  const postGeometry = new THREE.BoxGeometry(0.26, 3.4, 0.26);
  for (const x of [-2.5, 2.5]) {
    const post = new THREE.Mesh(postGeometry, m.plywood);
    post.position.set(x, 1.7, 0);
    post.castShadow = true;
    post.receiveShadow = true;
    gate.add(post);
  }

  const signFace = new THREE.MeshStandardMaterial({ map: gateSignTexture(), roughness: 0.82 });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.92, 0.14), [
    m.plywoodEdge,
    m.plywoodEdge,
    m.plywoodEdge,
    m.plywoodEdge,
    signFace,
    m.plywoodEdge,
  ]);
  sign.position.y = 2.5;
  sign.castShadow = true;
  sign.receiveShadow = true;
  gate.add(sign);

  /* Lamps, benches, planters ------------------------------------------------- */

  const lamps = [
    new THREE.Vector3(7.8, 0, 16.4),
    new THREE.Vector3(-7.8, 0, 16.4),
    new THREE.Vector3(20.4, 0, 12.6),
    new THREE.Vector3(-20.6, 0, 13.4),
    new THREE.Vector3(-19.4, 0, -10.6),
    new THREE.Vector3(17.6, 0, -4.4),
    new THREE.Vector3(1.6, 0, -19.6),
  ].map((at) => {
    const lamp = createLamp(m, at);
    group.add(lamp.group);
    return lamp;
  });

  group.add(
    createBench(m, new THREE.Vector3(6.8, 0, 12.4), -0.35),
    createBench(m, new THREE.Vector3(-6.8, 0, 12.4), 0.35),
    createBench(m, new THREE.Vector3(19.2, 0, 10.6), -1.1),
    createPlanter(m, new THREE.Vector3(21.4, 0, -1.6), 1.3, 5),
    createPlanter(m, new THREE.Vector3(-3.6, 0, 20.4), 1.2, 9),
    createPlanter(m, new THREE.Vector3(12.6, 0, 17.6), 1.4, 13),
    createPlanter(m, new THREE.Vector3(-21.6, 0, -3.4), 1.25, 17),
    createPlanter(m, new THREE.Vector3(-13.6, 0, 16.6), 1.1, 21),
  );

  /* The waveform: stepping stones that listen ------------------------------- */

  const STONES = 17;
  const stones: Array<{ mesh: THREE.Mesh; rest: number; height: number }> = [];
  const stoneGeometry = new THREE.CylinderGeometry(0.46, 0.5, 1, 22);
  for (let i = 0; i < STONES; i++) {
    const t = i / (STONES - 1);
    const rest = 0.28 + Math.abs(Math.sin(i * 1.24)) * 0.5;
    const mesh = new THREE.Mesh(stoneGeometry, i % 2 ? m.clayRubber : m.sageRubber);
    mesh.position.set((t - 0.5) * 14.4, rest / 2, 18.2 - Math.sin(t * Math.PI) * 1.2);
    mesh.scale.y = rest;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    stones.push({ mesh, rest, height: rest });
  }

  scene.add(group);

  return {
    group,
    /**
     * `level` is the microphone, 0–1. The stones rise into the shape of the
     * voice the park is hearing, wherever in the park it is being spoken.
     */
    update(dt: number, t: number, level: number) {
      lamps.forEach((lamp, i) => {
        const material = lamp.head.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 2.6 + Math.sin(t * 0.8 + i * 1.7) * 0.25;
      });

      stones.forEach((stone, i) => {
        const wave = Math.sin(t * 5.5 - i * 0.55) * 0.5 + 0.5;
        const want = stone.rest + level * (0.5 + wave * 2.2);
        stone.height = damp(stone.height, want, 9, dt);
        stone.mesh.scale.y = stone.height;
        stone.mesh.position.y = stone.height / 2;
      });
    },
  };
}
