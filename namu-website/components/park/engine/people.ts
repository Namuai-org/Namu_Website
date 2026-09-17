import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { SPOTS, VIEW_YAW } from "./layout";
import type { Materials } from "./materials";
import { moundHeight } from "./talkTubes";
import { rng } from "./textures";

/**
 * The people, at the scale an architect's model has them: no faces, no detail,
 * just enough of a figure to say how big the sculptures are and where you are
 * meant to stand. Two of them walk the loop; the rest are mid-conversation.
 */
export function createPeople(scene: THREE.Scene, m: Materials) {
  const group = new THREE.Group();
  const geometry = figureGeometry();
  const r = rng(53);

  const standing: Array<{ mesh: THREE.Mesh; phase: number; baseY: number }> = [];
  const stand = (x: number, z: number, yaw: number, height: number, warm: boolean, y = 0) => {
    const mesh = new THREE.Mesh(geometry, warm ? m.figureWarm : m.figure);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(height);
    mesh.rotation.y = yaw;
    mesh.castShadow = true;
    group.add(mesh);
    standing.push({ mesh, phase: r() * Math.PI * 2, baseY: y });
  };

  // One at each whisper dish, turned to the ring they are speaking into.
  stand(SPOTS.dishHa.x + 1.7, SPOTS.dishHa.z + 0.3, -Math.PI / 2, 1.72, false);
  stand(SPOTS.dishFr.x - 1.7, SPOTS.dishFr.z - 0.3, Math.PI / 2, 1.64, true);

  // A child at the tunnel's mouth, and someone waiting at the tray.
  stand(2.2, -7.3, VIEW_YAW.transcribe + 0.4, 1.18, true);
  stand(17.1, -14.3, VIEW_YAW.transcribe + Math.PI - 0.5, 1.7, false);

  // Someone at the slate, chalk in hand.
  stand(9.5, 6.2, VIEW_YAW.voice + Math.PI, 1.68, true);

  // The talk tubes: one speaking into the near tube, a child on the mound.
  stand(SPOTS.mound.x + 3.2, SPOTS.mound.z + 3.4, VIEW_YAW.agent + Math.PI, 1.74, false);
  stand(
    SPOTS.mound.x - 0.6,
    SPOTS.mound.z - 0.4,
    VIEW_YAW.agent + 2.2,
    1.14,
    true,
    moundHeight(0.72),
  );

  // And two on the stepping stones, seeing what the park does with a shout.
  stand(-2.4, 17.6, 0.6, 1.66, false);
  stand(-1.5, 18.4, 0.2, 1.1, true);

  /* The loop around the south of the plaza ---------------------------------- */

  const loop = new THREE.CatmullRomCurve3(
    [
      [10.5, 11],
      [7.4, 14.3],
      [0, 15.6],
      [-7.4, 14.3],
      [-10.5, 11],
      [-7.4, 7.7],
      [0, 6.4],
      [7.4, 7.7],
    ].map(([x, z]) => new THREE.Vector3(x, 0, z)),
    true,
    "catmullrom",
    0.5,
  );

  const walkers = [
    { mesh: new THREE.Mesh(geometry, m.figure), height: 1.75, t: 0.1, speed: 0.021 },
    { mesh: new THREE.Mesh(geometry, m.figureWarm), height: 1.2, t: 0.086, speed: 0.021 },
    { mesh: new THREE.Mesh(geometry, m.figureWarm), height: 1.68, t: 0.62, speed: -0.017 },
  ];
  for (const walker of walkers) {
    walker.mesh.scale.setScalar(walker.height);
    walker.mesh.castShadow = true;
    group.add(walker.mesh);
  }

  scene.add(group);

  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();

  return {
    group,
    update(dt: number, t: number) {
      for (const { mesh, phase, baseY } of standing) {
        // Weight shifting from foot to foot, nothing more.
        mesh.rotation.z = Math.sin(t * 0.9 + phase) * 0.018;
        mesh.position.y = baseY + Math.sin(t * 1.4 + phase) * 0.012;
      }

      for (const walker of walkers) {
        walker.t = (walker.t + walker.speed * dt + 1) % 1;
        loop.getPointAt(walker.t, point);
        loop.getTangentAt(walker.t, tangent);
        walker.mesh.position.set(
          point.x,
          Math.abs(Math.sin(t * 4.4 + walker.t * 40)) * 0.035,
          point.z,
        );
        walker.mesh.rotation.y =
          Math.atan2(tangent.x, tangent.z) * Math.sign(walker.speed) +
          (walker.speed < 0 ? Math.PI : 0);
        walker.mesh.rotation.z = Math.sin(t * 4.4 + walker.t * 40) * 0.03;
      }
    },
  };
}

/** A figure one metre tall, in one piece, ready to be scaled to a person. */
function figureGeometry() {
  const parts: THREE.BufferGeometry[] = [];

  const body = new THREE.CapsuleGeometry(0.085, 0.3, 4, 12);
  body.translate(0, 0.62, 0);
  parts.push(body);

  const head = new THREE.SphereGeometry(0.075, 16, 12);
  head.translate(0, 0.905, 0);
  parts.push(head);

  for (const side of [-1, 1]) {
    const leg = new THREE.CapsuleGeometry(0.037, 0.28, 3, 8);
    leg.translate(side * 0.045, 0.2, 0);
    parts.push(leg);

    const arm = new THREE.CapsuleGeometry(0.027, 0.24, 3, 8);
    arm.rotateZ(side * 0.14);
    arm.translate(side * 0.1, 0.6, 0);
    parts.push(arm);
  }

  return mergeGeometries(parts, false)!;
}
