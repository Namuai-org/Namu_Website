import * as THREE from "three";
import { HEX } from "./palette";
import { softDotTexture } from "./textures";

/** Frame-rate independent easing toward a target. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));

/** The arc sound takes between two places in the park. */
export function arcBetween(from: THREE.Vector3, to: THREE.Vector3, lift = 0.35) {
  const mid = from.clone().lerp(to, 0.5);
  mid.y += from.distanceTo(to) * lift;
  return new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
}

const UP = new THREE.Vector3(0, 0, 1);

/**
 * Rings of sound leaving a mouth or a dish.
 *
 * A pool of flat rings, each released with the strength of the voice behind it,
 * widening and fading as it goes. Nothing in the park moves without a reason,
 * so a ring only ever means: something was heard here, or said here.
 */
export class PulseRings {
  readonly group = new THREE.Group();
  private readonly rings: Array<{
    mesh: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
    t: number;
    strength: number;
  }> = [];
  private readonly life: number;
  private readonly from: number;
  private readonly to: number;

  constructor(
    parent: THREE.Object3D,
    {
      count = 6,
      color = HEX.sahel,
      from = 0.3,
      to = 3.4,
      life = 2.2,
      thickness = 0.13,
    }: { count?: number; color?: string; from?: number; to?: number; life?: number; thickness?: number } = {},
  ) {
    this.life = life;
    this.from = from;
    this.to = to;

    const geometry = new THREE.RingGeometry(1 - thickness, 1, 48);
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      mesh.visible = false;
      mesh.renderOrder = 2;
      this.group.add(mesh);
      this.rings.push({ mesh, t: 1, strength: 1 });
    }
    parent.add(this.group);
  }

  /** Puts the rings where they leave from, facing the way sound travels. */
  setPose(position: THREE.Vector3, direction: THREE.Vector3) {
    this.group.position.copy(position);
    this.group.quaternion.setFromUnitVectors(UP, direction.clone().normalize());
  }

  emit(strength = 1) {
    const free = this.rings.find((r) => r.t >= 1);
    if (!free) return;
    free.t = 0;
    free.strength = THREE.MathUtils.clamp(strength, 0.15, 1);
    free.mesh.visible = true;
  }

  update(dt: number) {
    for (const ring of this.rings) {
      if (ring.t >= 1) continue;
      ring.t = Math.min(1, ring.t + dt / this.life);
      const eased = 1 - Math.pow(1 - ring.t, 2.2);
      const scale = THREE.MathUtils.lerp(this.from, this.to, eased) * (0.65 + ring.strength * 0.35);
      ring.mesh.scale.setScalar(scale);
      ring.mesh.material.opacity = (1 - ring.t) * 0.62 * ring.strength;
      if (ring.t >= 1) ring.mesh.visible = false;
    }
  }

  dispose() {
    this.rings[0]?.mesh.geometry.dispose();
    this.rings.forEach((r) => r.mesh.material.dispose());
    this.group.removeFromParent();
  }
}

/**
 * Words on their way: motes running along a curve from one place to another.
 * They are the only thing in the park that shows a model working.
 */
export class MoteStream {
  readonly points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private curve: THREE.Curve<THREE.Vector3>;
  private readonly count: number;
  private readonly offsets: Float32Array;
  private readonly jitter: Float32Array;
  private readonly speed: number;
  private time = 0;
  private level = 0;
  private target = 0;
  private readonly cursor = new THREE.Vector3();

  constructor(
    parent: THREE.Object3D,
    curve: THREE.Curve<THREE.Vector3>,
    { count = 42, color = HEX.led, size = 0.34, speed = 0.42 }: { count?: number; color?: string; size?: number; speed?: number } = {},
  ) {
    this.curve = curve;
    this.count = count;
    this.speed = speed;
    this.offsets = new Float32Array(count);
    this.jitter = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      this.offsets[i] = i / count;
      this.jitter[i * 3] = (Math.random() - 0.5) * 0.5;
      this.jitter[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      this.jitter[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    this.points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color,
        size,
        map: softDotTexture(),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    this.points.visible = false;
    this.points.frustumCulled = false;
    parent.add(this.points);
  }

  setCurve(curve: THREE.Curve<THREE.Vector3>) {
    this.curve = curve;
  }

  play() {
    this.target = 1;
    this.points.visible = true;
  }

  stop() {
    this.target = 0;
  }

  update(dt: number) {
    this.level = damp(this.level, this.target, 3.5, dt);
    if (this.level < 0.01 && this.target === 0) {
      this.points.visible = false;
      return;
    }
    this.time += dt * this.speed;

    const position = this.points.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < this.count; i++) {
      const t = (this.offsets[i] + this.time) % 1;
      this.curve.getPoint(t, this.cursor);
      // Fade in and out at the ends so motes appear to leave and arrive.
      const edge = Math.min(1, Math.min(t, 1 - t) * 8);
      const spread = 0.35 + (1 - edge) * 0.2;
      position.setXYZ(
        i,
        this.cursor.x + this.jitter[i * 3] * spread,
        this.cursor.y + this.jitter[i * 3 + 1] * spread,
        this.cursor.z + this.jitter[i * 3 + 2] * spread,
      );
    }
    position.needsUpdate = true;
    this.points.material.opacity = this.level * 0.85;
  }

  dispose() {
    this.points.geometry.dispose();
    this.points.material.dispose();
    this.points.removeFromParent();
  }
}
