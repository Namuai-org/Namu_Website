import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Materials } from "./materials";
import { shadows } from "./materials";
import { SKY } from "./palette";
import { rng, softDotTexture } from "./textures";

/** Low in the west, so shadows run long across the plaza toward the camera's right. */
export const SUN_DIRECTION = new THREE.Vector3(-0.82, 0.44, 0.48).normalize();

export function createSky(scene: THREE.Scene) {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      zenith: { value: new THREE.Color(SKY.zenith) },
      mid: { value: new THREE.Color(SKY.mid) },
      horizon: { value: new THREE.Color(SKY.horizon) },
      sunColor: { value: new THREE.Color(SKY.sun) },
      sunDir: { value: SUN_DIRECTION.clone() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = p.xyww;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 zenith;
      uniform vec3 mid;
      uniform vec3 horizon;
      uniform vec3 sunColor;
      uniform vec3 sunDir;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 col = mix(horizon, mid, smoothstep(-0.02, 0.2, h));
        col = mix(col, zenith, smoothstep(0.2, 0.8, h));
        float s = max(dot(d, normalize(sunDir)), 0.0);
        // A wide warm haze around the sun, and a soft disc at its heart.
        col += sunColor * (pow(s, 5.0) * 0.28 + pow(s, 48.0) * 0.55 + smoothstep(0.9975, 0.999, s) * 1.6);
        col = mix(col, horizon * 0.94, smoothstep(0.0, -0.25, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(360, 48, 24), material);
  sky.renderOrder = -1;
  scene.add(sky);
  scene.fog = new THREE.Fog(SKY.fog, 95, 340);
  return sky;
}

export function createLights(scene: THREE.Scene, lowPower: boolean) {
  const hemi = new THREE.HemisphereLight("#fff6ec", "#dcc0a0", 1.15);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight("#ffe4c8", 3.1);
  sun.position.copy(SUN_DIRECTION).multiplyScalar(70);
  sun.castShadow = true;
  const size = lowPower ? 1024 : 2048;
  sun.shadow.mapSize.set(size, size);
  const cam = sun.shadow.camera;
  cam.left = -34;
  cam.right = 34;
  cam.top = 34;
  cam.bottom = -34;
  cam.near = 20;
  cam.far = 160;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight("#ffeedd", 0.4);
  fill.position.set(30, 22, -18);
  scene.add(fill);

  return { hemi, sun, fill };
}

/** Rolling ridges on the horizon, paler with distance, with one tall peak under the sun. */
export function createHills(scene: THREE.Scene) {
  const layers = [
    { radius: 130, height: 10, color: "#d6ae8b", seed: 3 },
    { radius: 175, height: 17, color: "#e2bfa1", seed: 7 },
    { radius: 230, height: 29, color: "#ecd2b8", seed: 11 },
  ];
  const sunAngle = Math.atan2(SUN_DIRECTION.z, SUN_DIRECTION.x);

  for (const layer of layers) {
    const segments = 220;
    const positions: number[] = [];
    const indices: number[] = [];
    const r = rng(layer.seed);
    const phases = [r() * 6.28, r() * 6.28, r() * 6.28];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      let h =
        layer.height *
        (0.45 +
          0.3 * Math.sin(a * 3 + phases[0]) +
          0.18 * Math.sin(a * 7 + phases[1]) +
          0.08 * Math.sin(a * 17 + phases[2]));
      // The peak from the cover plate, standing into the low sun.
      const d = Math.atan2(Math.sin(a - sunAngle - 0.35), Math.cos(a - sunAngle - 0.35));
      h += layer.height * 1.9 * Math.exp(-(d * d) / 0.02);
      const x = Math.cos(a) * layer.radius;
      const z = Math.sin(a) * layer.radius;
      positions.push(x, -2, z, x, Math.max(0.5, h), z);
      if (i < segments) {
        const k = i * 2;
        indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: layer.color, roughness: 1, side: THREE.DoubleSide }),
    );
    scene.add(mesh);
  }

  const sand = new THREE.Mesh(
    new THREE.CircleGeometry(420, 64),
    new THREE.MeshStandardMaterial({ color: "#ecd8b8", roughness: 1 }),
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = -0.03;
  sand.receiveShadow = true;
  scene.add(sand);
}

/** A flat-topped acacia: a leaning trunk that forks, and wide layered canopy. */
function acaciaGeometry(seed: number) {
  const r = rng(seed);
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.15 * (r() - 0.5), 1.4, 0.1),
    new THREE.Vector3(0.35 * (r() - 0.5), 2.7, -0.1),
  ]);
  const trunk = new THREE.TubeGeometry(trunkCurve, 12, 0.16, 6);
  const branches: THREE.BufferGeometry[] = [trunk];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + r();
    const branch = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.5, 0),
      new THREE.Vector3(Math.cos(a) * 0.8, 3.2, Math.sin(a) * 0.8),
      new THREE.Vector3(Math.cos(a) * 1.7, 3.6, Math.sin(a) * 1.7),
    ]);
    branches.push(new THREE.TubeGeometry(branch, 8, 0.07, 5));
  }
  const wood = mergeGeometries(branches)!;

  const puffs: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + r() * 0.6;
    const d = i === 0 ? 0 : 1.1 + r() * 0.9;
    const g = new THREE.IcosahedronGeometry(1, 1);
    g.scale(1.5 + r() * 0.8, 0.34 + r() * 0.12, 1.3 + r() * 0.7);
    g.translate(Math.cos(a) * d, 3.75 + r() * 0.35, Math.sin(a) * d);
    puffs.push(g);
  }
  const canopy = mergeGeometries(puffs)!;
  return { wood, canopy };
}

export function createTrees(scene: THREE.Scene, m: Materials) {
  const variants = [acaciaGeometry(4), acaciaGeometry(9), acaciaGeometry(15)];
  const r = rng(31);
  const group = new THREE.Group();

  const place = (x: number, z: number, scale: number, near: boolean) => {
    const v = variants[Math.floor(r() * variants.length)];
    const tree = new THREE.Group();
    tree.add(new THREE.Mesh(v.wood, m.bark));
    tree.add(new THREE.Mesh(v.canopy, near ? m.foliage : m.foliageDark));
    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);
    tree.rotation.y = r() * Math.PI * 2;
    if (near) shadows(tree, true, false);
    group.add(tree);
  };

  // Around the plaza's rim, leaving the camera's side open.
  const rim = [10, 40, 62, 85, 108, 133, 155, 178, 200, 222, 240, 300, 322, 345];
  rim.forEach((deg, i) => {
    const a = (deg * Math.PI) / 180;
    const d = 34 + (i % 3) * 3.5;
    place(Math.cos(a) * d, -Math.sin(a) * d, 0.92 + r() * 0.3, true);
  });
  // A scattered savanna beyond it.
  for (let i = 0; i < 52; i++) {
    const a = r() * Math.PI * 2;
    const d = 52 + r() * 80;
    place(Math.cos(a) * d, Math.sin(a) * d, 1 + r() * 1.1, false);
  }
  scene.add(group);
  return group;
}

/** Warm dust hanging in the low light. */
export function createDust(scene: THREE.Scene, count: number) {
  const r = rng(5);
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (r() - 0.5) * 64;
    positions[i * 3 + 1] = 0.4 + r() * 10;
    positions[i * 3 + 2] = (r() - 0.5) * 64;
    speeds[i] = 0.08 + r() * 0.25;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: "#ffdcb2",
      size: 0.13,
      map: softDotTexture(),
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(points);

  return (dt: number, t: number) => {
    const p = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = p.getY(i) + speeds[i] * dt;
      if (y > 10.5) y = 0.4;
      p.setY(i, y);
      p.setX(i, p.getX(i) + Math.sin(t * 0.3 + i) * 0.004);
    }
    p.needsUpdate = true;
  };
}
