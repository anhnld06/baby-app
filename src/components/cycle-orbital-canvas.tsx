"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { isReducedMotionPreferred, supportsWebGL } from "@/lib/webgl";

export type BiologicalPhase = "period" | "follicular" | "fertile" | "luteal";

const PHASE_PALETTES: Record<
  BiologicalPhase,
  { pearl: number; ring: number; halo: number; gem: number }
> = {
  period: {
    pearl: 0xf7bbc8,
    ring: 0xf9cdd7,
    halo: 0xfde2e7,
    gem: 0xffffff,
  },
  follicular: {
    pearl: 0xfad2c8,
    ring: 0xfce0d8,
    halo: 0xfff0ea,
    gem: 0xfff8f2,
  },
  fertile: {
    pearl: 0x9be5dc,
    ring: 0xc2f3ec,
    halo: 0xe4fbf7,
    gem: 0xffffff,
  },
  luteal: {
    pearl: 0xe6c4df,
    ring: 0xf2d9ec,
    halo: 0xfbeaf5,
    gem: 0xfff6fb,
  },
};

function createGlowTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.4, "rgba(255, 245, 248, 0.65)");
  grad.addColorStop(1, "rgba(255, 245, 248, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function CycleOrbitalCanvas({
  progress,
  phase,
  onReady,
}: {
  progress: number;
  phase: BiologicalPhase;
  onReady?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const phaseRef = useRef<BiologicalPhase>(phase);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    progressRef.current = progress;
    phaseRef.current = phase;
    onReadyRef.current = onReady;
  }, [progress, phase, onReady]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !supportsWebGL()) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
    camera.position.set(0, 0, 4.9);

    const ambient = new THREE.AmbientLight(0xfff6f8, 1.45);
    const key = new THREE.DirectionalLight(0xffffff, 1.75);
    key.position.set(2.2, 2.8, 4.0);
    const rim = new THREE.PointLight(0x9ee6dc, 1.15, 10);
    rim.position.set(-2.4, -1.8, 3.0);
    scene.add(ambient, key, rim);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const root = new THREE.Group();
    scene.add(root);

    // Central translucent lunar pearl behind the day counter
    const pearlGeo = track(new THREE.SphereGeometry(0.92, 36, 36));
    const pearlMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf7bbc8,
        emissive: 0x6f273d,
        emissiveIntensity: 0.35,
        roughness: 0.28,
        metalness: 0.04,
        transparent: true,
        opacity: 0.38,
        clearcoat: 0.7,
        clearcoatRoughness: 0.25,
      }),
    );
    const pearl = new THREE.Mesh(pearlGeo, pearlMat);
    root.add(pearl);

    // Main cycle track ring
    const trackGeo = track(new THREE.TorusGeometry(1.18, 0.036, 20, 96));
    const trackMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xf9cdd7,
        emissive: 0xf7bbc8,
        emissiveIntensity: 0.25,
        roughness: 0.3,
        metalness: 0.12,
        transparent: true,
        opacity: 0.42,
      }),
    );
    const mainRing = new THREE.Mesh(trackGeo, trackMat);
    root.add(mainRing);

    // Progress arc built dynamically up to current cycle progress
    const clampedRatio = Math.min(1, Math.max(0.04, progressRef.current / 100));
    const arcGeo = track(
      new THREE.TorusGeometry(1.18, 0.052, 20, 72, clampedRatio * Math.PI * 2),
    );
    const arcMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffeef2,
        emissiveIntensity: 0.55,
        roughness: 0.2,
        metalness: 0.1,
      }),
    );
    const progressArc = new THREE.Mesh(arcGeo, arcMat);
    // Sweep clockwise from 12 o'clock directly into the current-day marker gem
    progressArc.rotation.set(0, 0, Math.PI / 2 - clampedRatio * Math.PI * 2);
    root.add(progressArc);

    // Delicate tilted silk halo
    const haloGeo = track(new THREE.TorusGeometry(1.32, 0.012, 14, 96));
    const haloMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfde2e7,
        emissive: 0xffffff,
        emissiveIntensity: 0.3,
        roughness: 0.35,
        transparent: true,
        opacity: 0.48,
      }),
    );
    const silkHalo = new THREE.Mesh(haloGeo, haloMat);
    silkHalo.rotation.set(0.55, 0.35, 0);
    root.add(silkHalo);

    // Current-day marker gem + soft sprite glow
    const gemGroup = new THREE.Group();
    root.add(gemGroup);
    const gemGeo = track(new THREE.SphereGeometry(0.115, 24, 24));
    const gemMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xfff5f8,
        emissiveIntensity: 0.65,
        roughness: 0.15,
        clearcoat: 1,
      }),
    );
    gemGroup.add(new THREE.Mesh(gemGeo, gemMat));

    const glowTex = createGlowTexture();
    if (glowTex) track(glowTex);
    const spriteMat = track(
      new THREE.SpriteMaterial({
        map: glowTex ?? undefined,
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    );
    const gemGlow = new THREE.Sprite(spriteMat);
    gemGlow.scale.setScalar(0.52);
    gemGroup.add(gemGlow);

    // Floating subtle stardust motes
    const moteCount = 18;
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      const a = (i / moteCount) * Math.PI * 2;
      const r = 1.24 + ((i * 31) % 100) / 100 * 0.25;
      motePos[i * 3] = Math.cos(a) * r;
      motePos[i * 3 + 1] = Math.sin(a) * r;
      motePos[i * 3 + 2] = (((i * 17) % 100) / 100 - 0.5) * 0.4;
    }
    const moteGeo = track(new THREE.BufferGeometry());
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
    const moteMat = track(
      new THREE.PointsMaterial({
        color: 0xfff3f6,
        size: 0.14,
        map: glowTex ?? undefined,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      }),
    );
    const motes = new THREE.Points(moteGeo, moteMat);
    root.add(motes);

    const applyPhaseColors = () => {
      const palette = PHASE_PALETTES[phaseRef.current];
      pearlMat.color.setHex(palette.pearl);
      trackMat.color.setHex(palette.ring);
      haloMat.color.setHex(palette.halo);
      gemMat.color.setHex(palette.gem);
    };
    applyPhaseColors();

    const updateSize = () => {
      const width = container.clientWidth || 144;
      const height = container.clientHeight || 144;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    updateSize();

    let currentAngle =
      Math.PI / 2 - Math.min(1, Math.max(0.04, progressRef.current / 100)) * Math.PI * 2;
    let rafId: number | null = null;
    let inView = true;
    let reducedMotion = isReducedMotionPreferred();
    let announced = false;
    const startClock = performance.now();

    const renderFrame = (now: number) => {
      const t = (now - startClock) * 0.001;
      const targetRatio = Math.min(1, Math.max(0.04, progressRef.current / 100));
      const targetAngle = Math.PI / 2 - targetRatio * Math.PI * 2;
      currentAngle += (targetAngle - currentAngle) * 0.1;

      gemGroup.position.set(
        Math.cos(currentAngle) * 1.18,
        Math.sin(currentAngle) * 1.18,
        0.08,
      );
      const gemPulse = reducedMotion ? 1 : 1 + Math.sin(t * 2.4) * 0.08;
      gemGroup.scale.setScalar(gemPulse);

      if (!reducedMotion) {
        pearl.scale.setScalar(1 + Math.sin(t * 1.4) * 0.025);
        silkHalo.rotation.z = t * 0.25;
        silkHalo.rotation.x = 0.55 + Math.sin(t * 0.7) * 0.12;
        motes.rotation.z = -t * 0.08;
        root.rotation.y = Math.sin(t * 0.6) * 0.1;
        root.rotation.x = Math.cos(t * 0.5) * 0.08;
      }

      applyPhaseColors();
      renderer.render(scene, camera);
      if (!announced) {
        announced = true;
        onReadyRef.current?.();
      }
    };

    const tick = (now: number) => {
      renderFrame(now);
      if (!reducedMotion && inView && document.visibilityState === "visible") {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const syncLoop = () => {
      if (reducedMotion) {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
        renderFrame(performance.now());
        return;
      }
      if (inView && document.visibilityState === "visible" && rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      } else if ((!inView || document.visibilityState !== "visible") && rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    renderFrame(performance.now());
    syncLoop();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      renderFrame(performance.now());
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true;
        syncLoop();
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(container);

    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      syncLoop();
    };
    motionMedia.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", syncLoop);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionMedia.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", syncLoop);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className="size-full" />;
}
