"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  isDarkDocument,
  isReducedMotionPreferred,
  supportsWebGL,
} from "@/lib/webgl";

type TrimesterPalette = {
  primary: number;
  secondary: number;
  ringA: number;
  ringB: number;
  mote: number;
};

const LIGHT_PALETTES: Record<1 | 2 | 3, TrimesterPalette> = {
  1: {
    primary: 0xf4b6c2,
    secondary: 0xfbe0ce,
    ringA: 0xe396a8,
    ringB: 0xf0c4a8,
    mote: 0xe0899d,
  },
  2: {
    primary: 0xec9fb0,
    secondary: 0xf9d2be,
    ringA: 0xd97d93,
    ringB: 0xeab696,
    mote: 0xd46f87,
  },
  3: {
    primary: 0xe594a8,
    secondary: 0xf6caa8,
    ringA: 0xcf6e86,
    ringB: 0xe4ab80,
    mote: 0xc9667d,
  },
};

const DARK_PALETTE: TrimesterPalette = {
  primary: 0xd9899b,
  secondary: 0xb98594,
  ringA: 0xec9aaa,
  ringB: 0xd8a88e,
  mote: 0xf2b5c2,
};

function createSoftGlowTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.38, "rgba(255, 244, 246, 0.65)");
  gradient.addColorStop(1, "rgba(255, 244, 246, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function PregnancyAuraCanvas({
  week,
  trimester,
  className,
}: {
  week: number;
  trimester: 1 | 2 | 3;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetScaleRef = useRef(0.82 + Math.min(41, Math.max(1, week)) * 0.0085);
  const pulseRef = useRef(0);
  const trimesterRef = useRef<1 | 2 | 3>(trimester);
  const initialWeekRef = useRef(week);

  useEffect(() => {
    targetScaleRef.current = 0.82 + Math.min(41, Math.max(1, week)) * 0.0085;
    trimesterRef.current = trimester;
    if (initialWeekRef.current !== week) {
      initialWeekRef.current = week;
      pulseRef.current = 1;
    }
  }, [week, trimester]);

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
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
    camera.position.set(0, 0, 5.8);

    const ambientLight = new THREE.AmbientLight(0xfff5f5, 1.35);
    const keyLight = new THREE.DirectionalLight(0xfff0e8, 1.6);
    keyLight.position.set(2.5, 3.2, 4.2);
    const rimLight = new THREE.PointLight(0xf6b8c6, 1.4, 12);
    rimLight.position.set(-2.2, -1.5, 3.0);
    scene.add(ambientLight, keyLight, rimLight);

    const anchor = new THREE.Group();
    scene.add(anchor);

    const auraGroup = new THREE.Group();
    anchor.add(auraGroup);

    // Soft translucent inner cocoon sphere
    const coreGeo = new THREE.IcosahedronGeometry(0.92, 4);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xf9cbd5,
      emissive: 0xfce4ea,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.0,
      transparent: true,
      opacity: 0.14,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    auraGroup.add(coreMesh);

    // Two delicate silk orbital rings
    const ringAGeo = new THREE.TorusGeometry(1.28, 0.013, 16, 96);
    const ringAMat = new THREE.MeshStandardMaterial({
      color: 0xe396a8,
      emissive: 0xf4bac8,
      emissiveIntensity: 0.28,
      roughness: 0.3,
      metalness: 0.08,
      transparent: true,
      opacity: 0.34,
    });
    const ringA = new THREE.Mesh(ringAGeo, ringAMat);
    ringA.rotation.set(0.95, 0.35, 0.2);

    const ringBGeo = new THREE.TorusGeometry(1.5, 0.01, 16, 96);
    const ringBMat = new THREE.MeshStandardMaterial({
      color: 0xf0c4a8,
      emissive: 0xf8dcc8,
      emissiveIntensity: 0.25,
      roughness: 0.35,
      metalness: 0.06,
      transparent: true,
      opacity: 0.28,
    });
    const ringB = new THREE.Mesh(ringBGeo, ringBMat);
    ringB.rotation.set(-0.78, -0.48, 0.4);
    auraGroup.add(ringA, ringB);

    // Floating warm pearl satellites
    const orbGeo = new THREE.SphereGeometry(1, 24, 24);
    const orbSpecs = [
      { radius: 1.3, size: 0.08, speed: 0.42, phase: 0.3, tilt: 0.42 },
      { radius: 1.46, size: 0.062, speed: -0.34, phase: 2.1, tilt: -0.35 },
      { radius: 1.18, size: 0.052, speed: 0.5, phase: 3.8, tilt: 0.28 },
      { radius: 1.58, size: 0.068, speed: -0.28, phase: 5.0, tilt: -0.22 },
      { radius: 1.1, size: 0.048, speed: 0.38, phase: 1.25, tilt: -0.5 },
    ];
    const orbMats = orbSpecs.map(
      (_, idx) =>
        new THREE.MeshStandardMaterial({
          color: idx % 2 === 0 ? 0xf8c8d4 : 0xfde2cf,
          emissive: idx % 2 === 0 ? 0xf5b8c8 : 0xfad6be,
          emissiveIntensity: 0.42,
          roughness: 0.2,
          metalness: 0.04,
          transparent: true,
          opacity: 0.82,
        }),
    );
    const orbs = orbSpecs.map((spec, idx) => {
      const mesh = new THREE.Mesh(orbGeo, orbMats[idx]);
      mesh.scale.setScalar(spec.size);
      auraGroup.add(mesh);
      return { mesh, ...spec };
    });

    // Feathery stardust bokeh particles
    const moteCount = 34;
    const motePositions = new Float32Array(moteCount * 3);
    const moteSeeds = new Float32Array(moteCount);
    for (let i = 0; i < moteCount; i++) {
      const angle = (i / moteCount) * Math.PI * 2 + (i % 5) * 0.37;
      const r = 0.75 + ((i * 29) % 100) / 100 * 1.55;
      motePositions[i * 3] = Math.cos(angle) * r;
      motePositions[i * 3 + 1] = (((i * 47) % 100) / 100 - 0.5) * 2.4;
      motePositions[i * 3 + 2] = Math.sin(angle) * r * 0.55 - 0.2;
      moteSeeds[i] = ((i * 19) % 100) / 100 * Math.PI * 2;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
    const glowTexture = createSoftGlowTexture();
    const moteMat = new THREE.PointsMaterial({
      color: 0xe0899d,
      size: 0.16,
      map: glowTexture ?? undefined,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    anchor.add(motes);

    let dark = isDarkDocument();
    const applyPalette = () => {
      const palette = dark ? DARK_PALETTE : LIGHT_PALETTES[trimesterRef.current];
      coreMat.color.setHex(palette.primary);
      coreMat.opacity = dark ? 0.1 : 0.14;
      ringAMat.color.setHex(palette.ringA);
      ringAMat.opacity = dark ? 0.28 : 0.34;
      ringBMat.color.setHex(palette.ringB);
      ringBMat.opacity = dark ? 0.22 : 0.28;
      moteMat.color.setHex(palette.mote);
      moteMat.opacity = dark ? 0.42 : 0.55;
      orbMats.forEach((mat, idx) => {
        mat.color.setHex(idx % 2 === 0 ? palette.primary : palette.secondary);
        mat.opacity = dark ? 0.58 : 0.8;
      });
    };
    applyPalette();

    const updateSize = () => {
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 240;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Frame the aura right around the baby illustration in the upper-right quadrant of .hero
      const aspect = width / height;
      if (aspect < 0.95) {
        anchor.position.set(aspect * 0.58, 0.82, 0);
        anchor.scale.setScalar(0.56);
      } else {
        anchor.position.set(aspect * 0.54, 0.38, 0);
        anchor.scale.setScalar(0.76);
      }
    };
    updateSize();

    let currentScale = targetScaleRef.current;
    let rafId: number | null = null;
    let inView = true;
    let reducedMotion = isReducedMotionPreferred();
    const startClock = performance.now();

    const renderFrame = (now: number) => {
      const elapsed = (now - startClock) * 0.001;
      currentScale += (targetScaleRef.current - currentScale) * 0.06;
      pulseRef.current *= 0.93;
      const breath = reducedMotion ? 0 : Math.sin(elapsed * 1.15) * 0.035;
      const pulseBoost = pulseRef.current * 0.09;
      auraGroup.scale.setScalar(currentScale + breath + pulseBoost);

      coreMesh.rotation.y = elapsed * 0.16;
      coreMesh.rotation.x = Math.sin(elapsed * 0.3) * 0.15;

      ringA.rotation.z = elapsed * 0.18 + pulseRef.current * 0.25;
      ringA.rotation.x = 0.95 + Math.sin(elapsed * 0.45) * 0.08;
      ringB.rotation.z = -elapsed * 0.14 - pulseRef.current * 0.2;
      ringB.rotation.y = -0.48 + Math.cos(elapsed * 0.38) * 0.08;

      for (const orb of orbs) {
        const a = elapsed * orb.speed + orb.phase;
        orb.mesh.position.set(
          Math.cos(a) * orb.radius,
          Math.sin(a * 1.3) * orb.radius * orb.tilt,
          Math.sin(a) * orb.radius * 0.55,
        );
      }

      if (!reducedMotion) {
        motes.rotation.y = elapsed * 0.05;
        motes.position.y = Math.sin(elapsed * 0.6) * 0.08;
      }

      applyPalette();
      renderer.render(scene, camera);
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

    const themeObserver = new MutationObserver(() => {
      dark = isDarkDocument();
      renderFrame(performance.now());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

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
      themeObserver.disconnect();
      motionMedia.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", syncLoop);
      coreGeo.dispose();
      coreMat.dispose();
      ringAGeo.dispose();
      ringAMat.dispose();
      ringBGeo.dispose();
      ringBMat.dispose();
      orbGeo.dispose();
      orbMats.forEach((mat) => mat.dispose());
      moteGeo.dispose();
      moteMat.dispose();
      glowTexture?.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className={className} />;
}
