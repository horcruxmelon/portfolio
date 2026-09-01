"use client";

import { useEffect, useRef } from "react";

const SETTINGS = {
  scale: 1.4,
  gridMul: [2, 1] as [number, number],
  digitSize: 1.2,
  timeScale: 0.5,
  scanlineIntensity: 0.4,
  glitchAmount: 1,
  flickerAmount: 1,
  noiseAmp: 1,
  chromaticAberration: 0,
  dither: 0,
  curvature: 0.2,
  mouseReact: true,
  mouseStrength: 0.4,
  brightness: 1,
  maskStrength: 0.62,
};

const TINT: [number, number, number] = [0.66, 0.33, 0.97];

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3 iResolution;
uniform float uScale;
uniform vec2 uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3 uTint;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uBrightness;
uniform float uMaskStrength;

float time;

float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2;
}
mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
float fbm(vec2 p) {
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;
  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);
  return f;
}
float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}
float hShape(vec2 c) {
  float leftBar = step(abs(c.x + 0.17), 0.085) * step(abs(c.y), 0.34);
  float rightBar = step(abs(c.x - 0.17), 0.085) * step(abs(c.y), 0.34);
  float midBar = step(abs(c.x), 0.26) * step(abs(c.y), 0.06);
  return clamp(leftBar + rightBar + midBar, 0.0, 1.0);
}
float digit(vec2 p){
  vec2 grid = uGridMul * 15.0;
  vec2 s = floor(p * grid) / grid;
  p = p * grid;
  vec2 q, r;
  float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;

  vec2 maskUv = s / uScale;
  vec2 c = maskUv - 0.5;
  c.x *= iResolution.x / iResolution.y;
  intensity += hShape(c) * uMaskStrength;

  if(uUseMouse > 0.5){
    vec2 mouseWorld = uMouse * uScale;
    float distToMouse = distance(s, mouseWorld);
    float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
    intensity += mouseInfluence;
    float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
    intensity += ripple;
  }
  p = fract(p);
  p *= uDigitSize;
  float px5 = p.x * 5.0;
  float py5 = (1.0 - p.y) * 5.0;
  float x = fract(px5);
  float y = fract(py5);
  float i = floor(py5) - 2.0;
  float j = floor(px5) - 2.0;
  float n = i * i + j * j;
  float f = n * 0.0625;
  float isOn = step(0.1, intensity - f);
  float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
  return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}
float onOff(float a, float b, float c) {
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}
float displace(vec2 look) {
  float y = look.y - mod(iTime * 0.25, 1.0);
  float window = 1.0 / (1.0 + 50.0 * y * y);
  return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}
vec3 getColor(vec2 p){
  float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
  bar *= uScanlineIntensity;
  float displacement = displace(p);
  p.x += displacement;
  if (uGlitchAmount != 1.0) {
    float extra = displacement * (uGlitchAmount - 1.0);
    p.x += extra;
  }
  float middle = digit(p);
  const float off = 0.002;
  float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off))
    + digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0))
    + digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
  vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
  return baseColor;
}
vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}
void main() {
  time = iTime * 0.333333;
  vec2 uv = vUv;
  if(uCurvature != 0.0){
    uv = barrel(uv);
  }
  vec2 p = uv * uScale;
  vec3 col = getColor(p);
  if(uChromaticAberration != 0.0){
    vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
    col.r = getColor(p + ca).r;
    col.b = getColor(p - ca).b;
  }
  col *= uTint;
  col *= uBrightness;
  if(uDither > 0.0){
    float rnd = hash21(gl_FragCoord.xy);
    col += (rnd - 0.5) * (uDither * 0.003922);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function GlyphField() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const { Renderer, Program, Mesh, Color, Triangle } = await import("ogl");
      if (cancelled || !container) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const renderer = new Renderer({ dpr });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 1);

      const geometry = new Triangle(gl);

      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: new Color(
              gl.canvas.width,
              gl.canvas.height,
              gl.canvas.width / gl.canvas.height
            ),
          },
          uScale: { value: SETTINGS.scale },
          uGridMul: { value: new Float32Array(SETTINGS.gridMul) },
          uDigitSize: { value: SETTINGS.digitSize },
          uScanlineIntensity: { value: SETTINGS.scanlineIntensity },
          uGlitchAmount: { value: SETTINGS.glitchAmount },
          uFlickerAmount: { value: SETTINGS.flickerAmount },
          uNoiseAmp: { value: SETTINGS.noiseAmp },
          uChromaticAberration: { value: SETTINGS.chromaticAberration },
          uDither: { value: SETTINGS.dither },
          uCurvature: { value: SETTINGS.curvature },
          uTint: { value: new Color(TINT[0], TINT[1], TINT[2]) },
          uMouse: { value: new Float32Array([0.5, 0.5]) },
          uMouseStrength: { value: SETTINGS.mouseStrength },
          uUseMouse: { value: SETTINGS.mouseReact ? 1 : 0 },
          uBrightness: { value: SETTINGS.brightness },
          uMaskStrength: { value: SETTINGS.maskStrength },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });

      function resize() {
        if (!container) return;
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        program.uniforms.iResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();

      container.appendChild(gl.canvas);

      const mouse = { x: 0.5, y: 0.5 };
      const smoothMouse = { x: 0.5, y: 0.5 };

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) / rect.width;
        mouse.y = 1 - (e.clientY - rect.top) / rect.height;
      };
      if (SETTINGS.mouseReact) {
        container.addEventListener("mousemove", onMouseMove);
      }

      const timeOffset = Math.random() * 100;
      let rafId = 0;

      function update(t: number) {
        rafId = requestAnimationFrame(update);
        const elapsed = (t * 0.001 + timeOffset) * SETTINGS.timeScale;
        program.uniforms.iTime.value = elapsed;

        if (SETTINGS.mouseReact) {
          smoothMouse.x += (mouse.x - smoothMouse.x) * 0.08;
          smoothMouse.y += (mouse.y - smoothMouse.y) * 0.08;
          program.uniforms.uMouse.value[0] = smoothMouse.x;
          program.uniforms.uMouse.value[1] = smoothMouse.y;
        }

        renderer.render({ scene: mesh });
      }

      if (reduceMotion) {
        renderer.render({ scene: mesh });
      } else {
        rafId = requestAnimationFrame(update);
      }

      cleanup = () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        container.removeEventListener("mousemove", onMouseMove);
        if (gl.canvas.parentElement === container) {
          container.removeChild(gl.canvas);
        }
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
