"use client";

import { useEffect, useRef } from "react";

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

/**
 * A slow, organic field of soft diagonal strokes in the Namu palette.
 *
 * The look comes from domain-warped fBm noise sampled in a rotated, heavily
 * anisotropic space: squashing one axis stretches the noise cells into long
 * brush-like streaks, and warping the sample position with a second noise
 * field gives them their liquid, hand-made curl.
 */
const FRAG = `#version 300 es
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uMouse;
uniform float uIntro;

out vec4 fragColor;

/* --- 2D simplex noise (Ashima / Gustavson) ---------------------------- */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float amp = 0.5;
  float sum = 0.0;
  for (int i = 0; i < 5; i++) {
    sum += amp * snoise(p);
    p = p * 2.03 + vec2(1.7, -3.1);
    amp *= 0.5;
  }
  return sum;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

/* --- Namu palette ------------------------------------------------------ */
const vec3 KOLA      = vec3(0.420, 0.243, 0.118); // #6B3E1E
const vec3 SAHEL     = vec3(0.910, 0.576, 0.353); // #E8935A
const vec3 DRY_CLAY  = vec3(0.929, 0.851, 0.690); // #EDD9B0
const vec3 PAPER     = vec3(1.000, 0.980, 0.945); // #FFFAF1

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  vec2 p = uv - 0.5;
  p.x *= aspect;

  // Rotate the sampling space so the strokes run across the canvas.
  const float ANG = -0.66;
  mat2 rot = mat2(cos(ANG), -sin(ANG), sin(ANG), cos(ANG));
  vec2 q = rot * p;

  // Squash one axis: noise cells become long strokes rather than blobs.
  q.x *= 0.30;

  float t = uTime * 0.055;

  // A gentle pull toward the cursor keeps the field feeling alive.
  q += uMouse * 0.06;

  // Domain warp — this is what gives the strokes their curl.
  vec2 warp = vec2(
    fbm(q * 1.5 + vec2(0.0, t)),
    fbm(q * 1.5 + vec2(5.2, -t * 0.8))
  );

  float n = fbm(q * 2.1 + warp * 0.85 + vec2(t * 0.5, t * 1.2));
  n = n * 0.5 + 0.5;

  // A second, coarser field adds the broad light/dark drift across the frame.
  float broad = fbm(rot * p * 0.9 + vec2(-t * 0.4, t * 0.25)) * 0.5 + 0.5;

  float v = mix(n, broad, 0.35);

  // Ramp through the palette: deep Kola in the troughs, Sahel through the
  // midtones, Dry Clay and Paper catching the crests.
  vec3 col = mix(KOLA, SAHEL, smoothstep(0.18, 0.58, v));
  col = mix(col, DRY_CLAY, smoothstep(0.56, 0.86, v));
  col = mix(col, PAPER, smoothstep(0.82, 1.0, v) * 0.55);

  // Warm the lower edge so the section melts into the page background.
  col = mix(col, SAHEL * 0.82, smoothstep(0.55, 1.0, 1.0 - uv.y) * 0.18);

  // Soft top falloff toward Paper, so the floating nav always has contrast.
  col = mix(col, PAPER, smoothstep(0.88, 1.0, uv.y) * 0.35);

  // Dither — at these low frequencies banding is very visible otherwise.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.012;

  // Intro: bloom up from Paper on first paint.
  col = mix(PAPER, col, uIntro);

  fragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type Props = {
  className?: string;
  /** Render scale. The field is very low frequency, so half res is plenty. */
  resolutionScale?: number;
};

export function GradientField({ className = "", resolutionScale = 0.6 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });

    // No WebGL2 — the CSS gradient underneath the canvas stands in.
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Fullscreen triangle — cheaper than a quad and avoids the diagonal seam.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uIntro = gl.getUniformLocation(program, "uIntro");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(
        1,
        Math.round(rect.width * dpr * resolutionScale),
      );
      const h = Math.max(
        1,
        Math.round(rect.height * dpr * resolutionScale),
      );
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Cursor influence, smoothed so it drifts rather than snaps.
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Only run while the canvas is actually on screen.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    let raf = 0;
    let intro = 0;
    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (!onScreen || document.hidden) return;

      intro = Math.min(1, intro + dt * 0.8);
      // Ease the bloom so it arrives softly rather than linearly.
      const eased = 1 - Math.pow(1 - intro, 3);

      gl.uniform1f(uTime, reduced ? 12 : (now - start) / 1000);
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      gl.uniform2f(uMouse, reduced ? 0 : mouse.x, reduced ? 0 : mouse.y);
      gl.uniform1f(uIntro, eased);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Reduced motion: one settled frame, then stop the loop entirely.
      if (reduced && intro >= 1) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [resolutionScale]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="An animated field of soft, flowing colour in Namu's warm palette"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        transform: "translateZ(0)",
        // Stands in before the first WebGL frame, and permanently if the
        // context is unavailable.
        background:
          "linear-gradient(155deg, #6B3E1E 0%, #E8935A 45%, #EDD9B0 78%, #FFFAF1 100%)",
      }}
    />
  );
}
