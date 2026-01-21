"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CommonClass,
  MouseClass,
  AutoDriver,
  ShaderPass,
  Advection,
  ExternalForce,
  Viscous,
  Divergence,
  Poisson,
  Pressure,
  Simulation,
  Output,
  WebGLManager,
  face_vert,
  line_vert,
  mouse_vert,
  advection_frag,
  color_frag,
  divergence_frag,
  externalForce_frag,
  poisson_frag,
  pressure_frag,
  viscous_frag,
} from '@/lib/liquid-ether';

export interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

interface LiquidEtherWebGL {
  output?: { simulation?: { options: SimOptions; resize: () => void } };
  autoDriver?: {
    enabled: boolean;
    speed: number;
    resumeDelay: number;
    rampDurationMs: number;
    mouse?: { autoIntensity: number; takeoverDuration: number };
    forceStop: () => void;
  };
  resize: () => void;
  start: () => void;
  pause: () => void;
  dispose: () => void;
}

const defaultColors = ['#5227FF', '#FF9FFC', '#B19EEF'];

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = defaultColors,
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}: LiquidEtherProps): React.ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<LiquidEtherWebGL | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    function makePaletteTexture(stops: string[]): THREE.DataTexture {
      let arr: string[];
      if (Array.isArray(stops) && stops.length > 0) {
        arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
      } else {
        arr = ['#ffffff', '#ffffff'];
      }
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    // Hard-code transparent background vector (alpha 0)
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    const Common = new CommonClass();
    const Mouse = new MouseClass();

    const container = mountRef.current;
    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    const webgl = new WebGLManager({
      $wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration
    }, Common, Mouse, paletteTex, bgVec4);
    webglRef.current = webgl;

    const applyOptionsFromProps = () => {
      if (!webglRef.current) return;
      const sim = webglRef.current.output?.simulation;
      if (!sim) return;
      const prevRes = sim.options.resolution;
      Object.assign(sim.options, {
        mouse_force: mouseForce,
        cursor_size: cursorSize,
        isViscous,
        viscous,
        iterations_viscous: iterationsViscous,
        iterations_poisson: iterationsPoisson,
        dt,
        BFECC,
        resolution,
        isBounce
      });
      if (resolution !== prevRes) sim.resize();
    };
    applyOptionsFromProps();
    webgl.start();

    const io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        isVisibleRef.current = isVisible;
        if (!webglRef.current) return;
        if (isVisible && !document.hidden) {
          webglRef.current.start();
        } else {
          webglRef.current.pause();
        }
      },
      { threshold: [0, 0.01, 0.1] }
    );
    io.observe(container);
    intersectionObserverRef.current = io;

    const ro = new ResizeObserver(() => {
      if (!webglRef.current) return;
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        if (!webglRef.current) return;
        webglRef.current.resize();
      });
    });
    ro.observe(container);
    resizeObserverRef.current = ro;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect();
        } catch {
          /* noop */
        }
      }
      if (intersectionObserverRef.current) {
        try {
          intersectionObserverRef.current.disconnect();
        } catch {
          /* noop */
        }
      }
      if (webglRef.current) {
        webglRef.current.dispose();
      }
      webglRef.current = null;
    };
  }, [
    BFECC,
    cursorSize,
    dt,
    isBounce,
    isViscous,
    iterationsPoisson,
    iterationsViscous,
    mouseForce,
    resolution,
    viscous,
    colors,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  useEffect(() => {
    const webgl = webglRef.current;
    if (!webgl) return;
    const sim = webgl.output?.simulation;
    if (!sim) return;
    const prevRes = sim.options.resolution;
    Object.assign(sim.options, {
      mouse_force: mouseForce,
      cursor_size: cursorSize,
      isViscous,
      viscous,
      iterations_viscous: iterationsViscous,
      iterations_poisson: iterationsPoisson,
      dt,
      BFECC,
      resolution,
      isBounce
    });
    if (webgl.autoDriver) {
      webgl.autoDriver.enabled = autoDemo;
      webgl.autoDriver.speed = autoSpeed;
      webgl.autoDriver.resumeDelay = autoResumeDelay;
      webgl.autoDriver.rampDurationMs = autoRampDuration * 1000;
      if (webgl.autoDriver.mouse) {
        webgl.autoDriver.mouse.autoIntensity = autoIntensity;
        webgl.autoDriver.mouse.takeoverDuration = takeoverDuration;
      }
    }
    if (resolution !== prevRes) sim.resize();
  }, [
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    dt,
    BFECC,
    resolution,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative overflow-hidden pointer-events-none touch-none ${className || ''}`}
      style={style}
    />
  );
}