import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { SPOTS, VIEW_YAW } from "./layout";
import { moundHeight } from "./talkTubes";
import { rng } from "./textures";

/**
 * The people.
 *
 * Built at a metre tall and scaled to each person, on the joints a body
 * actually turns on — hips, knees, shoulders, elbows, neck — so they can stand
 * with their weight on one leg, reach for a dish, sit on a bench, and walk
 * with their legs rather than glide with them. Clothes are cloth and skin is
 * skin: nobody in this park is a white plastic marker.
 */

/**
 * What the park is dressed in. Ordered deepest first and drawn with a bias
 * toward the front of the list: on a cream plaza in a cream light, a crowd in
 * cream disappears.
 */
const TOPS = ["#46536b", "#3f5a4b", "#6b4a30", "#cf865a", "#8d9a86", "#dfc7a4", "#efe3d2"];
const BOTTOMS = ["#3a4356", "#2f4438", "#4a3524", "#6b4a30", "#7a8a76"];
const SKIN = ["#8a5a3b", "#6f4526", "#a9713f", "#5c3620"];
const HAIR = "#241a14";

type Pose = "stand" | "speak" | "listen" | "write" | "reach" | "sit" | "walk";

type Figure = {
  root: THREE.Group;
  head: THREE.Group;
  hipL: THREE.Group;
  hipR: THREE.Group;
  kneeL: THREE.Group;
  kneeR: THREE.Group;
  shoulderL: THREE.Group;
  shoulderR: THREE.Group;
  elbowL: THREE.Group;
  elbowR: THREE.Group;
  pose: Pose;
  phase: number;
  baseY: number;
  height: number;
  /** Radians of leg swing per metre walked, so the feet keep up with the ground. */
  cadence: number;
  step: number;
  /** The small differences between one person standing and the next. */
  lean: number;
  tilt: number;
  armRest: number;
};

export function createPeople(scene: THREE.Scene) {
  const group = new THREE.Group();
  const r = rng(53);
  const kit = buildKit();
  const people: Figure[] = [];

  const place = (
    x: number,
    z: number,
    yaw: number,
    height: number,
    pose: Pose,
    options: { y?: number; robe?: boolean; wrap?: boolean; child?: boolean } = {},
  ) => {
    const figure = buildFigure(kit, r, {
      height,
      robe: options.robe ?? false,
      wrap: options.wrap ?? false,
      child: options.child ?? height < 1.4,
    });
    figure.root.position.set(x, options.y ?? 0, z);
    figure.root.rotation.y = yaw;
    figure.pose = pose;
    figure.phase = r() * Math.PI * 2;
    figure.baseY = options.y ?? 0;
    setPose(figure, pose);
    group.add(figure.root);
    people.push(figure);
    return figure;
  };

  /* Who is where ------------------------------------------------------------ */

  // One at each whisper dish: one speaking into the ring, one waiting on it.
  place(SPOTS.dishHa.x + 1.75, SPOTS.dishHa.z + 0.25, -Math.PI / 2, 1.72, "speak", { robe: true });
  place(SPOTS.dishFr.x - 1.75, SPOTS.dishFr.z - 0.3, Math.PI / 2, 1.63, "listen", { wrap: true });

  // A child at the tunnel's mouth, and someone waiting at the tray.
  place(2.2, -7.3, VIEW_YAW.transcribe + 0.4, 1.17, "stand", { child: true });
  place(17.1, -14.3, VIEW_YAW.transcribe + Math.PI - 0.5, 1.69, "reach");

  // At the slate, chalk in hand.
  place(9.5, 6.2, VIEW_YAW.voice + Math.PI, 1.66, "write", { wrap: true });

  // The talk tubes: one at the near tube, a child up on the mound, and
  // someone on the bench waiting for the answer.
  place(SPOTS.mound.x + 3.2, SPOTS.mound.z + 3.4, VIEW_YAW.agent + Math.PI, 1.74, "speak");
  place(SPOTS.mound.x - 0.6, SPOTS.mound.z - 0.4, VIEW_YAW.agent + 2.2, 1.12, "stand", {
    y: moundHeight(0.72),
    child: true,
  });
  place(SPOTS.mound.x - 3.4, SPOTS.mound.z + 5.3, VIEW_YAW.agent + 0.35, 1.68, "sit", {
    y: 0.46,
    robe: true,
  });

  // And two on the stepping stones, seeing what the park does with a shout.
  place(-2.4, 17.6, 0.6, 1.66, "stand", { wrap: true });
  place(-1.5, 18.4, 0.2, 1.08, "stand", { child: true });

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
  const loopLength = loop.getLength();

  const walkers = [
    { figure: place(0, 0, 0, 1.76, "walk", { wrap: true }), t: 0.1, speed: 0.021 },
    { figure: place(0, 0, 0, 1.19, "walk", { child: true }), t: 0.086, speed: 0.021 },
    { figure: place(0, 0, 0, 1.66, "walk", { robe: true }), t: 0.62, speed: -0.016 },
  ];

  scene.add(group);

  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();

  return {
    group,
    update(dt: number, t: number) {
      for (const figure of people) {
        if (figure.pose !== "walk") idle(figure, t);
      }

      for (const walker of walkers) {
        const { figure } = walker;
        walker.t = (walker.t + walker.speed * dt + 1) % 1;
        loop.getPointAt(walker.t, point);
        loop.getTangentAt(walker.t, tangent);

        figure.step += Math.abs(walker.speed) * dt * loopLength * figure.cadence;
        walk(figure, figure.step);

        figure.root.position.x = point.x;
        figure.root.position.z = point.z;
        figure.root.rotation.y =
          Math.atan2(tangent.x, tangent.z) + (walker.speed < 0 ? Math.PI : 0);
      }
    },
  };
}

/* ---- The body ------------------------------------------------------------- */

/** Every part, built once at a metre tall and shared by everyone. */
function buildKit() {
  const head = new THREE.SphereGeometry(0.062, 20, 16);
  head.scale(1, 1.14, 0.94);

  const hair = new THREE.SphereGeometry(0.066, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.62);
  hair.scale(1, 1.1, 0.98);

  const wrap = new THREE.TorusGeometry(0.056, 0.026, 10, 24);
  wrap.rotateX(Math.PI / 2);
  wrap.scale(1, 1, 0.94);

  const neck = new THREE.CylinderGeometry(0.026, 0.032, 0.07, 10);

  // Chest, shoulders and hips as one piece, flattened front to back the way a
  // body is rather than turned on a lathe.
  const chest = new THREE.CylinderGeometry(0.1, 0.068, 0.3, 18, 1);
  chest.scale(1, 1, 0.64);
  const shoulders = new THREE.CapsuleGeometry(0.052, 0.14, 4, 12);
  shoulders.rotateZ(Math.PI / 2);
  shoulders.scale(1, 1, 0.78);
  shoulders.translate(0, 0.135, 0);
  const pelvis = new THREE.SphereGeometry(0.072, 16, 12);
  pelvis.scale(1, 0.78, 0.66);
  pelvis.translate(0, -0.15, 0);
  const trunk = mergeGeometries([chest, shoulders, pelvis])!;

  // A boubou: one fall of cloth from the waist to the ankle.
  const robe = new THREE.CylinderGeometry(0.115, 0.165, 0.54, 20, 1, true);
  robe.scale(1, 1, 0.9);

  const thigh = new THREE.CapsuleGeometry(0.043, 0.16, 4, 10);
  thigh.translate(0, -0.12, 0);
  const shin = new THREE.CapsuleGeometry(0.034, 0.14, 4, 10);
  shin.translate(0, -0.11, 0);
  const foot = new THREE.BoxGeometry(0.052, 0.028, 0.105);
  foot.translate(0, -0.215, 0.022);

  const upperArm = new THREE.CapsuleGeometry(0.031, 0.12, 4, 10);
  upperArm.translate(0, -0.09, 0);
  const forearm = new THREE.CapsuleGeometry(0.026, 0.11, 4, 10);
  forearm.translate(0, -0.085, 0);
  const hand = new THREE.SphereGeometry(0.031, 12, 10);
  hand.scale(0.8, 1.1, 0.7);
  hand.translate(0, -0.165, 0);

  const sleeve = new THREE.CylinderGeometry(0.052, 0.078, 0.2, 12, 1, true);
  sleeve.translate(0, -0.1, 0);

  return { head, hair, wrap, neck, trunk, robe, thigh, shin, foot, upperArm, forearm, hand, sleeve };
}

type Kit = ReturnType<typeof buildKit>;

const materials = new Map<string, THREE.MeshStandardMaterial>();
const cloth = (color: string) => {
  const found = materials.get(color);
  if (found) return found;
  const made = new THREE.MeshStandardMaterial({ color, roughness: 0.88 });
  materials.set(color, made);
  return made;
};

/** Heights are given in metres; everything inside is built at one metre. */
function buildFigure(
  kit: Kit,
  r: () => number,
  { height, robe, wrap, child }: { height: number; robe: boolean; wrap: boolean; child: boolean },
): Figure {
  const skin = cloth(SKIN[Math.floor(r() * SKIN.length)]);
  /** Weighted toward the deeper end of the list. */
  const worn = cloth(TOPS[Math.floor(Math.pow(r(), 1.7) * TOPS.length)]);
  const second = cloth(BOTTOMS[Math.floor(r() * BOTTOMS.length)]);

  const root = new THREE.Group();
  root.scale.setScalar(height);

  // A child is not a short adult: the legs are a smaller share of the whole.
  const hipY = child ? 0.47 : 0.5;

  const body = new THREE.Mesh(kit.trunk, worn);
  body.position.y = hipY + 0.17;
  root.add(body);

  // A child's head is a larger share of the whole, which is most of what tells
  // a child from a short adult at this distance.
  const headGroup = new THREE.Group();
  headGroup.position.y = hipY + 0.368;
  headGroup.scale.setScalar(child ? 1.18 : 1);
  root.add(headGroup);
  headGroup.add(new THREE.Mesh(kit.neck, skin));
  const face = new THREE.Mesh(kit.head, skin);
  face.position.y = 0.075;
  headGroup.add(face);

  if (wrap) {
    const crown = new THREE.Mesh(kit.hair, second);
    crown.position.y = 0.075;
    headGroup.add(crown);
    const scarf = new THREE.Mesh(kit.wrap, second);
    scarf.position.y = 0.105;
    headGroup.add(scarf);
  } else {
    const crown = new THREE.Mesh(kit.hair, cloth(HAIR));
    crown.position.y = 0.079;
    headGroup.add(crown);
  }

  const arm = (side: -1 | 1) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.1, hipY + 0.3, 0);
    root.add(shoulder);
    shoulder.add(new THREE.Mesh(kit.upperArm, robe ? worn : skin));
    if (robe) shoulder.add(new THREE.Mesh(kit.sleeve, worn));

    const elbow = new THREE.Group();
    elbow.position.y = -0.18;
    shoulder.add(elbow);
    elbow.add(new THREE.Mesh(kit.forearm, robe ? worn : skin));
    elbow.add(new THREE.Mesh(kit.hand, skin));
    return { shoulder, elbow };
  };

  const left = arm(-1);
  const right = arm(1);

  const leg = (side: -1 | 1) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.052, hipY, 0);
    root.add(hip);
    const knee = new THREE.Group();
    knee.position.y = -0.245;
    hip.add(knee);
    // Under a robe there are no legs to see, only the hem swinging.
    if (!robe) {
      hip.add(new THREE.Mesh(kit.thigh, second));
      knee.add(new THREE.Mesh(kit.shin, second));
      knee.add(new THREE.Mesh(kit.foot, cloth("#4a3524")));
    }
    return { hip, knee };
  };

  const legL = leg(-1);
  const legR = leg(1);

  if (robe) {
    const gown = new THREE.Mesh(kit.robe, worn);
    gown.position.y = hipY - 0.18;
    root.add(gown);
  }

  root.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) object.castShadow = true;
  });

  return {
    root,
    head: headGroup,
    hipL: legL.hip,
    hipR: legR.hip,
    kneeL: legL.knee,
    kneeR: legR.knee,
    shoulderL: left.shoulder,
    shoulderR: right.shoulder,
    elbowL: left.elbow,
    elbowR: right.elbow,
    pose: "stand",
    phase: 0,
    baseY: 0,
    height,
    lean: (r() - 0.5) * 0.06,
    tilt: (r() - 0.5) * 0.16,
    armRest: 0.03 + r() * 0.07,
    // One cycle is two steps, and a step is about half a body height.
    cadence: Math.PI / (height * 0.52),
    step: 0,
  };
}

/* ---- What they are doing -------------------------------------------------- */

/** The rest position each figure returns to between small movements. */
function setPose(f: Figure, pose: Pose) {
  f.root.rotation.x = f.lean;
  f.shoulderL.rotation.set(f.armRest, 0, 0.07);
  f.shoulderR.rotation.set(f.armRest, 0, -0.07);
  f.elbowL.rotation.set(0.28, 0, 0);
  f.elbowR.rotation.set(0.28, 0, 0);
  f.hipL.rotation.set(0, 0, 0);
  f.hipR.rotation.set(0, 0, 0);
  f.kneeL.rotation.set(0, 0, 0);
  f.kneeR.rotation.set(0, 0, 0);
  f.head.rotation.set(0, 0, 0);

  switch (pose) {
    case "speak":
      // A hand cupped at the mouth, the other left at the side.
      f.shoulderR.rotation.set(-0.55, 0, -0.5);
      f.elbowR.rotation.set(-2.1, 0, 0);
      f.head.rotation.x = -0.08;
      break;
    case "listen":
      f.shoulderR.rotation.set(-0.2, 0, -0.78);
      f.elbowR.rotation.set(-2.3, 0, 0);
      f.head.rotation.set(0.05, 0.25, 0);
      break;
    case "write":
      f.shoulderR.rotation.set(-1.15, 0, -0.18);
      f.elbowR.rotation.set(-0.5, 0, 0);
      f.head.rotation.x = 0.12;
      break;
    case "reach":
      f.shoulderR.rotation.set(-0.85, 0, -0.1);
      f.elbowR.rotation.set(-0.35, 0, 0);
      f.head.rotation.x = 0.2;
      break;
    case "sit":
      f.hipL.rotation.x = -1.5;
      f.hipR.rotation.x = -1.5;
      f.kneeL.rotation.x = 1.45;
      f.kneeR.rotation.x = 1.45;
      f.shoulderL.rotation.set(-0.35, 0, 0.12);
      f.shoulderR.rotation.set(-0.35, 0, -0.12);
      f.elbowL.rotation.x = -0.6;
      f.elbowR.rotation.x = -0.6;
      break;
    default:
      // Weight on one leg, the other knee a little loose.
      f.hipL.rotation.x = 0.06;
      f.kneeR.rotation.x = 0.12;
      f.head.rotation.set(f.tilt * 0.4, f.tilt, 0);
      break;
  }
}

/** Standing still is never still: weight shifts, and a head turns. */
function idle(f: Figure, t: number) {
  const breath = Math.sin(t * 0.9 + f.phase);
  if (f.pose !== "sit") {
    f.root.rotation.z = breath * 0.012;
    f.root.position.y = f.baseY + Math.sin(t * 1.5 + f.phase) * 0.006;
  }
  const look = f.tilt + Math.sin(t * 0.35 + f.phase) * 0.22;
  f.head.rotation.y += (look - f.head.rotation.y) * 0.05;
  // Only the arm that is hanging sways; the one doing something holds still.
  const sway = breath * 0.05;
  f.shoulderL.rotation.x = f.armRest + sway;
  if (f.pose === "stand") f.shoulderR.rotation.x = f.armRest - sway;
}

/** Two steps to a cycle: legs swing, knees fold behind, arms answer them. */
function walk(f: Figure, step: number) {
  const swing = Math.sin(step);
  const other = -swing;

  f.hipL.rotation.x = swing * 0.52;
  f.hipR.rotation.x = other * 0.52;
  f.kneeL.rotation.x = Math.max(0, -swing) * 0.85 + 0.08;
  f.kneeR.rotation.x = Math.max(0, -other) * 0.85 + 0.08;

  f.shoulderL.rotation.x = other * 0.34;
  f.shoulderR.rotation.x = swing * 0.34;
  f.elbowL.rotation.x = -0.35 - Math.max(0, other) * 0.3;
  f.elbowR.rotation.x = -0.35 - Math.max(0, swing) * 0.3;

  // The body rises over each straight leg and rolls a little into the step.
  f.root.position.y = f.baseY + Math.abs(Math.cos(step)) * 0.018 * f.height;
  f.root.rotation.z = swing * 0.03;
  f.head.rotation.y = Math.sin(step * 0.5) * 0.06;
}
