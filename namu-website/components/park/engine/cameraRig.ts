import * as THREE from "three";
import { damp } from "./fx";
import type { View } from "./layout";

const DEG = Math.PI / 180;
const MIN_POLAR = 22 * DEG;
const MAX_POLAR = 84 * DEG;
const MIN_RADIUS = 7;
const MAX_RADIUS = 130;
const BASE_FOV = 38;

/** The part of the canvas the park should be composed into, in CSS pixels. */
export type Frame = { x: number; y: number; width: number; height: number };

type Pose = { target: THREE.Vector3; radius: number; polar: number; azimuth: number };

const poseOf = (view: View): Pose => ({
  target: new THREE.Vector3(...view.target),
  radius: view.radius,
  polar: view.polar * DEG,
  azimuth: view.azimuth * DEG,
});

/**
 * The camera, and the way it travels.
 *
 * Orbits a target with damping, flies between stations along a lifted arc so it
 * never cuts through a sculpture on the way, and shifts its own frustum so the
 * subject sits in whatever part of the screen the panel has left free.
 */
export function createCameraRig(
  camera: THREE.PerspectiveCamera,
  dom: HTMLElement,
  options: { reducedMotion?: boolean } = {},
) {
  const current: Pose = {
    target: new THREE.Vector3(),
    radius: 60,
    polar: 55 * DEG,
    azimuth: 20 * DEG,
  };
  const desired: Pose = {
    target: new THREE.Vector3(),
    radius: 60,
    polar: 55 * DEG,
    azimuth: 20 * DEG,
  };

  let flight: { from: Pose; to: Pose; t: number; duration: number; lift: number } | null = null;
  let size = { width: 1, height: 1 };
  let frame: Frame = { x: 0, y: 0, width: 1, height: 1 };
  const centre = new THREE.Vector2();
  const wantCentre = new THREE.Vector2();
  let centred = false;
  let autoRotate = false;
  let idleFor = 0;
  /** The view the camera was last sent to, so it can be reframed in place. */
  let composed: View | null = null;

  /* Input -------------------------------------------------------------------- */

  const pointers = new Map<number, THREE.Vector2>();
  let dragging = false;
  let moved = 0;
  let pinch = 0;

  const stopFlight = () => {
    if (!flight) return;
    flight = null;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!event.isPrimary && pointers.size === 0) return;
    pointers.set(event.pointerId, new THREE.Vector2(event.clientX, event.clientY));
    if (pointers.size === 1) {
      dragging = true;
      moved = 0;
    }
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = a.distanceTo(b);
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const next = new THREE.Vector2(event.clientX, event.clientY);

    if (pointers.size === 1 && dragging) {
      const dx = next.x - previous.x;
      const dy = next.y - previous.y;
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 5) {
        stopFlight();
        idleFor = 0;
        desired.azimuth -= dx * 0.0052;
        desired.polar = THREE.MathUtils.clamp(desired.polar + dy * 0.0042, MIN_POLAR, MAX_POLAR);
        // The drag should turn the park, not spin the camera through the floor.
        current.azimuth += (desired.azimuth - current.azimuth) * 0.35;
      }
    }

    pointers.set(event.pointerId, next);

    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const distance = a.distanceTo(b);
      if (pinch > 0) {
        stopFlight();
        idleFor = 0;
        desired.radius = THREE.MathUtils.clamp(
          desired.radius * (pinch / Math.max(1, distance)),
          MIN_RADIUS,
          MAX_RADIUS,
        );
      }
      pinch = distance;
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinch = 0;
    if (pointers.size === 0) dragging = false;
  };

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    stopFlight();
    idleFor = 0;
    const step = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
    desired.radius = THREE.MathUtils.clamp(
      desired.radius * Math.exp(step * 0.0013),
      MIN_RADIUS,
      MAX_RADIUS,
    );
  };

  dom.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  dom.addEventListener("wheel", onWheel, { passive: false });

  /* Framing ------------------------------------------------------------------ */

  /** How far back this subject has to be to fill the free part of the screen. */
  const fit = (view: View) => {
    const focal = size.height / 2 / Math.tan((BASE_FOV * DEG) / 2);
    const width = (view.size * focal) / Math.max(120, frame.width);
    const height = (view.size * 0.62 * focal) / Math.max(120, frame.height);
    // A station is framed, never surveyed: however narrow the screen, the
    // camera stays close enough that the sculpture is the subject.
    const wanted = Math.min(Math.max(view.radius, width, height), view.radius * (view.maxFit ?? 1.75));
    return THREE.MathUtils.clamp(wanted, MIN_RADIUS, MAX_RADIUS);
  };

  const applyProjection = () => {
    const { width: w, height: h } = size;
    const dx = centre.x - w / 2;
    const dy = centre.y - h / 2;
    const fullWidth = w + Math.abs(dx) * 2;
    const fullHeight = h + Math.abs(dy) * 2;

    camera.aspect = fullWidth / fullHeight;
    // Widening the virtual frame must not widen the lens, or the park would
    // appear to zoom out every time the panel opens.
    camera.fov =
      (2 * Math.atan(Math.tan((BASE_FOV * DEG) / 2) * (fullHeight / h))) / DEG;
    camera.setViewOffset(
      fullWidth,
      fullHeight,
      fullWidth / 2 - centre.x,
      fullHeight / 2 - centre.y,
      w,
      h,
    );
    camera.updateProjectionMatrix();
  };

  const place = () => {
    const sinPolar = Math.sin(current.polar);
    camera.position.set(
      current.target.x + current.radius * sinPolar * Math.sin(current.azimuth),
      current.target.y + current.radius * Math.cos(current.polar),
      current.target.z + current.radius * sinPolar * Math.cos(current.azimuth),
    );
    camera.position.y = Math.max(camera.position.y, 1.6);
    camera.lookAt(current.target);
  };

  return {
    camera,

    /** Snap straight to a view, with no travel. */
    jumpTo(view: View) {
      const pose = poseOf(view);
      pose.radius = fit(view);
      composed = view;
      current.target.copy(pose.target);
      current.radius = pose.radius;
      current.polar = pose.polar;
      current.azimuth = pose.azimuth;
      desired.target.copy(pose.target);
      desired.radius = pose.radius;
      desired.polar = pose.polar;
      desired.azimuth = pose.azimuth;
      flight = null;
      place();
    },

    /** Travel to a view, lifting over the park on the way. */
    flyTo(view: View, duration = 1.5) {
      const to = poseOf(view);
      to.radius = fit(view);
      composed = view;
      // Take the short way round.
      const turn = ((to.azimuth - current.azimuth + Math.PI) % (Math.PI * 2)) - Math.PI;
      to.azimuth = current.azimuth + (turn < -Math.PI ? turn + Math.PI * 2 : turn);

      desired.target.copy(to.target);
      desired.radius = to.radius;
      desired.polar = to.polar;
      desired.azimuth = to.azimuth;

      if (options.reducedMotion) {
        current.target.copy(to.target);
        current.radius = to.radius;
        current.polar = to.polar;
        current.azimuth = to.azimuth;
        flight = null;
        return;
      }

      const travel = current.target.distanceTo(to.target);
      flight = {
        from: {
          target: current.target.clone(),
          radius: current.radius,
          polar: current.polar,
          azimuth: current.azimuth,
        },
        to,
        t: 0,
        duration,
        lift: Math.min(18, travel * 0.55 + Math.abs(turn) * 3),
      };
    },

    /** The free part of the canvas, where the sculpture should be composed. */
    setFrame(next: Frame, immediate = false) {
      frame = next;
      wantCentre.set(next.x + next.width / 2, next.y + next.height / 2);
      if (immediate || !centred) {
        centre.copy(wantCentre);
        centred = true;
        applyProjection();
      }
      // A panel opening or closing changes how much room the park has, so the
      // camera pulls back or comes in to keep the sculpture whole.
      if (composed && !dragging) desired.radius = fit(composed);
    },

    resize(width: number, height: number) {
      size = { width, height };
      applyProjection();
    },

    setAutoRotate(on: boolean) {
      autoRotate = on && !options.reducedMotion;
    },

    /** True while the pointer is being dragged rather than tapped. */
    get dragged() {
      return moved > 5;
    },

    get flying() {
      return flight !== null;
    },

    update(dt: number) {
      idleFor += dt;

      if (flight) {
        flight.t = Math.min(1, flight.t + dt / flight.duration);
        const e =
          flight.t < 0.5
            ? 4 * flight.t * flight.t * flight.t
            : 1 - Math.pow(-2 * flight.t + 2, 3) / 2;
        const arc = Math.sin(Math.PI * flight.t);
        current.target.lerpVectors(flight.from.target, flight.to.target, e);
        current.radius =
          THREE.MathUtils.lerp(flight.from.radius, flight.to.radius, e) + arc * flight.lift;
        current.polar = THREE.MathUtils.lerp(flight.from.polar, flight.to.polar, e) - arc * 0.12;
        current.azimuth = THREE.MathUtils.lerp(flight.from.azimuth, flight.to.azimuth, e);
        if (flight.t >= 1) flight = null;
      } else {
        if (autoRotate && idleFor > 6) desired.azimuth += dt * 0.014;
        current.target.lerp(desired.target, 1 - Math.exp(-5 * dt));
        current.radius = damp(current.radius, desired.radius, 5, dt);
        current.polar = damp(current.polar, desired.polar, 6, dt);
        current.azimuth = damp(current.azimuth, desired.azimuth, 6, dt);
      }

      if (!centred || centre.distanceToSquared(wantCentre) > 0.25) {
        centre.x = damp(centre.x, wantCentre.x, 7, dt);
        centre.y = damp(centre.y, wantCentre.y, 7, dt);
        applyProjection();
      }

      place();
    },

    dispose() {
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
    },
  };
}

export type CameraRig = ReturnType<typeof createCameraRig>;
