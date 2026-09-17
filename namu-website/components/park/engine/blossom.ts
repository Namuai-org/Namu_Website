import * as THREE from "three";
import { damp } from "./fx";
import { DEFAULT_AZIMUTH } from "./layout";
import { hitVolume, type Materials } from "./materials";
import { HEX } from "./palette";

const RING_RADIUS = 5;
const TUBE = 0.38;
const BALL = 0.95;
const PLINTH_TOP = 0.34;
/** The ball rests on the plinth, and the stroke ends where the ball is. */
const BALL_Y = PLINTH_TOP + BALL * 0.74;

/**
 * The Blossom, built as a climbable arch.
 *
 * The mark is drawn once and used as drawn: three quarters of a circle opening
 * at the bottom right, and the Sahel ball resting at the end of the stroke. It
 * keeps the mark's own two colours and gains nothing else — the park's warmth
 * comes from the light falling on it, not from repainting it.
 */
export function createBlossom(scene: THREE.Scene, m: Materials) {
  const group = new THREE.Group();
  group.rotation.y = THREE.MathUtils.degToRad(DEFAULT_AZIMUTH);

  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(4.4, 4.62, PLINTH_TOP, 72),
    m.cream,
  );
  plinth.position.y = PLINTH_TOP / 2;
  plinth.receiveShadow = true;
  group.add(plinth);

  const ringMaterial = new THREE.MeshPhysicalMaterial({
    color: HEX.ink,
    roughness: 0.44,
    clearcoat: 0.45,
    clearcoatRoughness: 0.35,
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(RING_RADIUS, TUBE, 22, 180, Math.PI * 1.5),
    ringMaterial,
  );
  ring.position.y = RING_RADIUS + BALL_Y;
  ring.castShadow = true;
  ring.receiveShadow = true;
  group.add(ring);

  const ballMaterial = new THREE.MeshPhysicalMaterial({
    color: HEX.sahel,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    emissive: HEX.sahel,
    emissiveIntensity: 0,
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BALL, 48, 32), ballMaterial);
  // The end of the stroke, where the mark puts it.
  ball.position.set(0, BALL_Y, 0);
  ball.castShadow = true;
  ball.receiveShadow = true;
  group.add(ball);

  // A shallow socket, so the ball looks set into the plinth rather than dropped.
  const socket = new THREE.Mesh(
    new THREE.CylinderGeometry(BALL * 0.66, BALL * 0.92, 0.18, 36),
    m.plywood,
  );
  socket.position.set(0, PLINTH_TOP - 0.02, 0);
  socket.receiveShadow = true;
  group.add(socket);

  // Ground lights around the plinth: the park at dusk, lit from below.
  const pucks: THREE.Mesh[] = [];
  const puckGeometry = new THREE.CylinderGeometry(0.22, 0.24, 0.1, 16);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const puck = new THREE.Mesh(puckGeometry, m.glow(1.6));
    puck.position.set(Math.cos(a) * 3.95, PLINTH_TOP + 0.04, Math.sin(a) * 3.95);
    group.add(puck);
    pucks.push(puck);
  }

  const uplight = new THREE.PointLight("#ffbe86", 13, 14, 2);
  uplight.position.set(0, 0.9, 2.6);
  group.add(uplight);

  const hit = hitVolume(
    new THREE.Vector3(12.4, 12.4, 4.5),
    new THREE.Vector3(0, 6.2, 0),
  );
  group.add(hit);

  scene.add(group);

  let hover = 0;
  let hoverTarget = 0;

  return {
    group,
    hit,
    setHover(on: boolean) {
      hoverTarget = on ? 1 : 0;
    },
    update(dt: number, t: number) {
      hover = damp(hover, hoverTarget, 6, dt);
      ballMaterial.emissiveIntensity = hover * 0.32;
      const breath = 1.15 + Math.sin(t * 0.7) * 0.2;
      pucks.forEach((puck, i) => {
        const material = puck.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = breath + Math.sin(t * 0.9 + i) * 0.12;
      });
      uplight.intensity = 12 + Math.sin(t * 0.7) * 2;
    },
  };
}

export type Blossom = ReturnType<typeof createBlossom>;
