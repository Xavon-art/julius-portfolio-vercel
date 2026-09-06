"use client";

/* ------------------------------------------------------------------
   ProjectShader — a small WebGL2 canvas that paints a monochrome
   "data flow" backdrop behind each project hero.
   ------------------------------------------------------------------
   Two themes (selected by <Project.demo.shaderTheme>):
     "route" — field routes fanning in from the left and converging on
               a hub at the right, with traveling pulses + ripple rings.
     "grid"  — a faint data grid with a scanning column, scan row, and
               pulsing inventory-style bars along the bottom.

   Everything is strictly grayscale ink on the paper gradient, so it
   stays on-theme. The fragment shader does its own anti-aliasing
   (no ctx antialias → crisp 1px lines at any DPR).

   - DPR-aware sizing via ResizeObserver.
   - Pauses on user "reduce motion" (draws one static frame).
   - Cancels its own animation frame on unmount.
   - Falls back to nothing (CSS gradient shows) if WebGL2 is missing.
------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import type { ShaderTheme } from "@/lib/projects";

const VERT = `#version 300 es
void main() {
  vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform int   u_theme;

out vec4 outColor;

const float PI = 3.14159265359;

vec2 segA(vec4 s) { return vec2(s.x, s.y); }
vec2 segB(vec4 s) { return vec2(s.z, s.w); }

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float dotSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  return dot(pa, ba) / dot(ba, ba);
}

void main() {
  vec2 uv   = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  float px  = 1.0 / min(u_resolution.x, u_resolution.y);
  vec2  p   = uv * vec2(aspect, 1.0);

  // Paper gradient: near-white at top, hair darker at the bottom.
  vec3 top   = vec3(0.965, 0.968, 0.976);
  vec3 bottom= vec3(0.910, 0.916, 0.933);
  vec3 base  = mix(bottom, top, uv.y);
  vec3 ink   = vec3(0.11, 0.11, 0.12);
  float a    = 0.0;

  // --- faint base grid (both themes, route keeps it very quiet) ------
  float g = 1.0 / 12.0;
  float gx = smoothstep(g * 0.5, g * 0.5 - px, abs(fract(p.x / g) - 0.5));
  float gy = smoothstep(g * 0.5, g * 0.5 - px, abs(fract(p.y / g) - 0.5));
  a += (gx + gy) * (u_theme == 0 ? 0.028 : 0.16);

  if (u_theme == 0) {
    // ------------------------- ROUTE theme -------------------------
    // Six field routes fan in from the left and converge on a hub.
    vec4 seg[12] = vec4[12](
      vec4(0.10,0.28, 0.42,0.22), vec4(0.42,0.22, 0.78,0.50),
      vec4(0.10,0.28, 0.40,0.40), vec4(0.40,0.40, 0.78,0.50),
      vec4(0.08,0.52, 0.44,0.48), vec4(0.44,0.48, 0.78,0.50),
      vec4(0.08,0.52, 0.38,0.62), vec4(0.38,0.62, 0.78,0.50),
      vec4(0.14,0.74, 0.40,0.78), vec4(0.40,0.78, 0.78,0.50),
      vec4(0.14,0.74, 0.46,0.58), vec4(0.46,0.58, 0.78,0.50)
    );
    float ph[12] = float[12](
      0.00,0.15, 0.30,0.05, 0.55,0.20, 0.70,0.80, 0.10,0.40, 0.90,0.60
    );

    vec2 F = vec2(aspect * 0.78, 0.5);

    for (int i = 0; i < 12; i++) {
      vec4 s = seg[i];
      vec2 a = vec2(s.x * aspect, s.y);
      vec2 b = vec2(s.z * aspect, s.w);

      float d   = sdSegment(p, a, b);
      float t   = clamp(dotSeg(p, a, b), 0.0, 1.0);
      float wave= 0.5 + 0.5 * sin(t * 22.0 - u_time * 5.0 + ph[i] * 6.283);

      float line = smoothstep(1.7 * px, 0.9 * px, d);
      float echo = smoothstep(4.5 * px, 2.2 * px, d) * 0.10;
      a += line * (0.34 + 0.50 * wave) + echo;

      // Traveling pulse dot along the route.
      float ht = fract(u_time * 0.10 + ph[i]);
      vec2  hp = mix(a, b, ht);
      float dp = length(p - hp);
      a += smoothstep(2.6 * px, 1.1 * px, dp) * 0.85;
      a += smoothstep(6.0 * px, 2.6 * px, dp) * 0.14 * (0.6 + 0.4 * wave);
    }

    // Soft glow behind the hub.
    float hubR = length(p - F);
    a += exp(-hubR * hubR * 16.0) * 0.07;

    // Expanding ripple rings.
    float rr = fract(u_time * 0.16);
    for (int k = 0; k < 3; k++) {
      float rk = rr + float(k) * 0.34;
      if (rk > 1.0) rk -= 1.0;
      float ring = abs(hubR - rk * 0.62);
      a += smoothstep(1.5 * px, 0.5 * px, ring) * (1.0 - rk) * 0.22;
    }
    a += smoothstep(3.0 * px, 1.2 * px, hubR) * 0.75;
  } else {
    // ------------------------- GRID theme --------------------------
    // A scanning column + a scan row reading the grid, with a row of
    // pulsing "inventory" bars anchored at the bottom edge.
    float scanX = fract(u_time * 0.045);
    float bandX = smoothstep(aspect * 0.02, 0.0, abs(p.x - scanX * aspect));
    a += bandX * 0.08;

    float scanY = fract(u_time * 0.035);
    float bandY = smoothstep(0.022, 0.0, abs(p.y - scanY));
    a += bandY * 0.06;

    for (int i = 0; i < 8; i++) {
      float xc  = (float(i) * 1.5 + 1.0) * g;
      float bob = 0.5 + 0.5 * sin(u_time * (0.9 + 0.18 * float(i)) + float(i) * 1.7);
      float h   = 0.05 + 0.07 * bob;
      vec2 pa   = vec2(xc * aspect, 0.05);
      vec2 pb   = vec2(xc * aspect, 0.05 + h);
      float db  = sdSegment(p, pa, pb);
      a += smoothstep(2.2 * px, 1.0 * px, db) * (0.16 + 0.22 * bob);
    }
  }

  vec3 col  = mix(base, ink, clamp(a, 0.0, 1.0));
  outColor  = vec4(col, 1.0);
}`;

export function ProjectShader({ theme }: { theme: ShaderTheme }) {
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

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uTheme = gl.getUniformLocation(program, "u_theme");

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
      gl.uniform1i(uTheme as WebGLUniformLocation, theme === "route" ? 0 : 1);
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
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
    />
  );
}