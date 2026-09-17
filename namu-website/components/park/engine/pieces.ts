import * as THREE from "three";
import type { Materials } from "./materials";
import { plateTexture, rng } from "./textures";

/**
 * The small furniture a park is actually made of: signs, benches, lamps,
 * planters. Every station uses the same pieces, so the place reads as one
 * park built by one hand rather than four exhibits standing near each other.
 */

/** A plywood sign on two legs: the station's name over the model that runs it. */
export function createPlaque(
  m: Materials,
  title: string,
  sub: string,
  position: THREE.Vector3,
  yaw: number,
  scale = 1,
) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.rotation.y = yaw;
  group.scale.setScalar(scale);

  const legGeometry = new THREE.BoxGeometry(0.09, 1.15, 0.09);
  for (const x of [-0.62, 0.62]) {
    const leg = new THREE.Mesh(legGeometry, m.plywoodEdge);
    leg.position.set(x, 0.575, 0);
    leg.castShadow = true;
    group.add(leg);
  }

  const face = new THREE.MeshStandardMaterial({
    map: plateTexture(title, sub, 2.1),
    roughness: 0.8,
  });
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.74, 0.07), [
    m.plywoodEdge,
    m.plywoodEdge,
    m.plywoodEdge,
    m.plywoodEdge,
    face,
    m.plywoodEdge,
  ]);
  board.position.y = 1.22;
  board.rotation.x = -0.14;
  board.castShadow = true;
  group.add(board);

  return group;
}

/** A seat of two plywood slabs, the kind bolted down beside a play structure. */
export function createBench(m: Materials, position: THREE.Vector3, yaw: number) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.rotation.y = yaw;

  const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.14, 0.52), m.plywood);
  seat.position.y = 0.46;
  seat.castShadow = true;
  seat.receiveShadow = true;
  group.add(seat);

  const legGeometry = new THREE.BoxGeometry(0.18, 0.46, 0.46);
  for (const x of [-0.78, 0.78]) {
    const leg = new THREE.Mesh(legGeometry, m.plywoodEdge);
    leg.position.set(x, 0.23, 0);
    leg.castShadow = true;
    group.add(leg);
  }
  return group;
}

/** A park lamp, just coming on. */
export function createLamp(m: Materials, position: THREE.Vector3, height = 4.4) {
  const group = new THREE.Group();
  group.position.copy(position);

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, height, 12), m.kola);
  post.position.y = height / 2;
  post.castShadow = true;
  group.add(post);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 14), m.bulb);
  head.position.y = height + 0.1;
  group.add(head);

  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.3, 16, 1, true), m.cream);
  shade.position.y = height + 0.3;
  group.add(shade);

  return { group, head };
}

/** A cream planter with a low, dry-country shrub in it. */
export function createPlanter(m: Materials, position: THREE.Vector3, radius = 1.2, seed = 3) {
  const r = rng(seed);
  const group = new THREE.Group();
  group.position.copy(position);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.9, 0.62, 28), m.cream);
  pot.position.y = 0.31;
  pot.castShadow = true;
  pot.receiveShadow = true;
  group.add(pot);

  const soil = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.94, 24), m.bark);
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.6;
  group.add(soil);

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + r();
    const d = r() * radius * 0.5;
    const bush = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius * (0.42 + r() * 0.26), 1),
      i % 2 ? m.foliage : m.foliageDark,
    );
    bush.position.set(Math.cos(a) * d, 0.72 + r() * 0.3, Math.sin(a) * d);
    bush.scale.y = 0.72;
    bush.castShadow = true;
    group.add(bush);
  }
  return group;
}

/** A cylinder laid between two points: a rod, an arm, a handrail. */
export function rod(
  material: THREE.Material,
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
) {
  const direction = to.clone().sub(from);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 8),
    material,
  );
  mesh.position.copy(from).addScaledVector(direction, 0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
  mesh.castShadow = true;
  return mesh;
}

/** A plywood step block, for climbing onto things. */
export function createStep(m: Materials, position: THREE.Vector3, size: THREE.Vector3, yaw = 0) {
  const step = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), m.plywood);
  step.position.copy(position);
  step.rotation.y = yaw;
  step.castShadow = true;
  step.receiveShadow = true;
  return step;
}
