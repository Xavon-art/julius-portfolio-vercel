"use client";

/* ------------------------------------------------------------------
   ConvergenceShader — a quiet monochrome WebGL2 backdrop for the
   "Why work with me" section.
   ------------------------------------------------------------------
   Theme intent: capability and range → "many platforms, one solution".
   Five strands flow in from the left and converge on a single hub at
   the right, with slow traveling pulses and a soft hub glow.

   This backdrop lives behind text-dense content, so the whole pattern
   runs at INTENSITY (0.5), about half the presence of the project-hero
   shaders. Same safety scaffold as ProjectShader: paper clear-color
   painted immediately, compile errors surfaced to the console and a
   graceful CSS-only fallback, DPR-aware resize, reduce-motion pause,
   context-lost handling, and full teardown on unmount.
------------------------------------------------------------------- */

import { useEffect, useRef } from "react";

const VERT = `#version 300 es
void main() {
  vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;

out vec4 outColor;

const float PI        = 3.14159265359;
const float INTENSITY = 0.5;

vec2 bez(vec2 a, vec2 c, vec2 b, float t) {
  float u = 1.0 - t;
  return u * u * a + 2.0 * u * t * c + t * t * b;
}

float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  float px  = 1.0 / min(u_resolution.x, u_resolution.y);
  vec2  p   = uv * vec2(aspect, 1.0);

  vec3 top    = vec3(0.980, 0.981, 0.983);
  vec3 bottom = vec3(0.945, 0.948, 0.957);
  vec3 base   = mix(bottom, top, uv.y);
  vec3 ink    = vec3(0.11, 0.11, 0.12);
  float a     = 0.0;

  // Faint base grid, quieter than the project shaders.
  float g  = 1.0 / 12.0;
  float gx = smoothstep(g * 0.5, g * 0.5 - px, abs(fract(p.x / g) - 0.5));
  float gy = smoothstep(g * 0.5, g * 0.5 - px, abs(fract(p.y / g) - 0.5));
  a += (gx + gy) * 0.015;

  vec2 hub = vec2(aspect * 0.66, 0.5);

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 A = vec2(aspect * 0.04, 0.16 + fi * 0.155);
    vec2 C = vec2(aspect * 0.30, 0.16 + fi * 0.155 - (fi - 2.0) * 0.10);
    vec2 B = hub + vec2(0.0, (fi - 2.0) * 0.02);
    float ph = fi * 0.45;

    vec2 prevPt = bez(A, C, B, 0.0);
    for (int j = 1; j <= 16; j++) {
      float t  = float(j) / 16.0;
      vec2  pt = bez(A, C, B, t);
      float d  = sdSeg(p, prevPt, pt);
      float wave = 0.5 + 0.5 * sin(t * 20.0 - u_time * 3.0 + ph * 6.283);
      a += smoothstep(2.2 * px, 0.9 * px, d) * (0.10 + 0.12 * wave);
      a += smoothstep(5.0 * px, 2.4 * px, d) * 0.04;
      prevPt = pt;
    }

    // Slow traveling pulse along the strand, flowing toward the hub.
    float ht = fract(u_time * 0.06 + ph);
    vec2  hp = bez(A, C, B, ht);
    float dp = length(p - hp);
    a += smoothstep(2.6 * px, 1.0 * px, dp) * 0.22;
    a += smoothstep(6.0 * px, 2.6 * px, dp) * 0.06;
  }

  // Soft hub glow + settled core + an occasional ripple.
  float hubD = length(p - hub);
  a += exp(-hubD * hubD * 10.0) * 0.05;
  a += smoothstep(3.2 * px, 1.2 * px, hubD) * 0.4;

  float rr  = fract(u_time * 0.12);
  float ring = abs(hubD - rr * 0.55);
  a += smoothstep(1.5 * px, 0.5 * px, ring) * (1.0 - rr) * 0.10;

  a *= INTENSITY;

  vec3 col = mix(base, ink, clamp(a, 0.0, 1.0));
  outColor = vec4(col, 1.0);
}`;

export function ConvergenceShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    gl.clearColor(0.98, 0.981, 0.983, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn(
          "[ConvergenceShader] shader compile failed:",
          gl.getShaderInfoLog(sh),
        );
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(
        "[ConvergenceShader] program link failed:",
        gl.getProgramInfoLog(program),
      );
      gl.deleteProgram(program);
      return;
    }

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");

    let raf = 0;
    let running = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(
        uResolution as WebGLUniformLocation,
        canvas.width,
        canvas.height,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (t: number) => {
      if (!running) return;
      gl.uniform1f(uTime as WebGLUniformLocation, t / 1000);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      gl.uniform1f(uTime as WebGLUniformLocation, 0);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMotion = () => {
      if (reduced.matches) {
        stop();
        gl.uniform1f(uTime as WebGLUniformLocation, 0);
        draw();
      } else if (!running) {
        start();
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    const parent = canvas.parentElement;
    if (parent) ro.observe(parent);

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const onRestored = () => {
      if (!reduced.matches) start();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    reduced.addEventListener("change", onMotion);

    resize();
    onMotion();

    return () => {
      stop();
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      reduced.removeEventListener("change", onMotion);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ background: "linear-gradient(#fafafb, #f1f2f4)" }}
    />
  );
}