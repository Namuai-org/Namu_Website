import * as THREE from "three";

export type StationId = "hub" | "interpret" | "transcribe" | "voice" | "agent";

export type Activity = "idle" | "recording" | "running" | "done" | "soon" | "error";

/**
 * Orbit around a target: radius in metres, angles in degrees, and how wide the
 * subject is so a narrow screen can pull the camera back far enough to hold it.
 */
export type View = {
  target: [number, number, number];
  radius: number;
  polar: number;
  azimuth: number;
  size: number;
  /** How much further than `radius` the camera may go to fit a narrow screen. */
  maxFit?: number;
};

/**
 * The plan of the park, in metres, with the Blossom at the origin and north at
 * −z. Everyone arrives from the south gate, so the Blossom is turned to face
 * that way and each station is framed from its own south side: the mark reads
 * as drawn, and no station is ever seen through another.
 */
export const PLAZA_RADIUS = 26;

/** Where the camera stands on arrival, and the way the Blossom faces. */
export const DEFAULT_AZIMUTH = 20;

export const SPOTS = {
  hub: new THREE.Vector3(0, 0, 0),
  dishHa: new THREE.Vector3(-20.5, 0, 5.5),
  dishFr: new THREE.Vector3(-10.5, 0, 5.5),
  tunnelStart: new THREE.Vector3(3.6, 0, -8.2),
  tunnelEnd: new THREE.Vector3(12.4, 0, -14.2),
  tray: new THREE.Vector3(15.6, 0, -15.8),
  horn: new THREE.Vector3(17.5, 0, 6.5),
  slate: new THREE.Vector3(10.5, 0, 5),
  mound: new THREE.Vector3(-13.5, 0, -12.8),
  gate: new THREE.Vector3(0, 0, 24),
} as const;

export const VIEWS: Record<StationId | "park", View> = {
  park: { target: [0, 1.4, -1.5], radius: 46, polar: 56, azimuth: DEFAULT_AZIMUTH, size: 47, maxFit: 3 },
  hub: { target: [0, 3.6, 0], radius: 17, polar: 70, azimuth: DEFAULT_AZIMUTH, size: 13 },
  interpret: { target: [-15.5, 1.9, 5.5], radius: 18, polar: 63, azimuth: 6, size: 15 },
  transcribe: { target: [8.5, 1.4, -12], radius: 17, polar: 62, azimuth: 25, size: 20 },
  voice: { target: [14, 2.2, 5.8], radius: 16.5, polar: 66, azimuth: -40, size: 15 },
  agent: { target: [-13.5, 1.8, -12.4], radius: 15, polar: 62, azimuth: 28, size: 14 },
};

/** Where each station's floating label is pinned. */
export const LABEL_ANCHORS: Record<StationId, THREE.Vector3> = {
  hub: new THREE.Vector3(0, 9.8, 0),
  interpret: new THREE.Vector3(-15.5, 5.4, 5.5),
  transcribe: new THREE.Vector3(7.6, 4.8, -11),
  voice: new THREE.Vector3(17.5, 6.8, 6.5),
  agent: new THREE.Vector3(-13.5, 5.2, -12.8),
};

export const STATION_ORDER: StationId[] = ["interpret", "transcribe", "voice", "agent"];

/** Everything a sculpture needs to know about what the console is doing. */
export type StationState = {
  activity: Activity;
  /** 0–1 loudness from the microphone while recording. */
  level: number;
  /** Which way the interpreter is running, when the station has directions. */
  variantId?: string;
  /** What is being written, or what came back. */
  text?: string;
};

/** A station is a sculpture that listens to the console and answers in light. */
export type Station = {
  id: StationId;
  group: THREE.Group;
  /** Invisible volumes that stand in for the sculpture when picking. */
  hits: THREE.Object3D[];
  setHover(on: boolean): void;
  setState(state: StationState): void;
  update(dt: number, t: number): void;
};

/** Floor paint and station signs read upright from that station's own view. */
export const VIEW_YAW: Record<StationId | "park", number> = {
  park: (VIEWS.park.azimuth * Math.PI) / 180,
  hub: (VIEWS.hub.azimuth * Math.PI) / 180,
  interpret: (VIEWS.interpret.azimuth * Math.PI) / 180,
  transcribe: (VIEWS.transcribe.azimuth * Math.PI) / 180,
  voice: (VIEWS.voice.azimuth * Math.PI) / 180,
  agent: (VIEWS.agent.azimuth * Math.PI) / 180,
};
