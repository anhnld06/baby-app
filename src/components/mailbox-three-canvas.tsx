"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  isDarkDocument,
  isReducedMotionPreferred,
  supportsWebGL,
} from "@/lib/webgl";

function createRoundedRectShape(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function createHeartShape(scale = 1) {
  const s = scale;
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.35 * s);
  shape.bezierCurveTo(-0.08 * s, -0.3 * s, -0.5 * s, -0.02 * s, -0.5 * s, 0.24 * s);
  shape.bezierCurveTo(-0.5 * s, 0.48 * s, -0.2 * s, 0.56 * s, 0, 0.34 * s);
  shape.bezierCurveTo(0.2 * s, 0.56 * s, 0.5 * s, 0.48 * s, 0.5 * s, 0.24 * s);
  shape.bezierCurveTo(0.5 * s, -0.02 * s, 0.08 * s, -0.3 * s, 0, -0.35 * s);
  return shape;
}

function createSparkleTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  glow.addColorStop(0, "rgba(255, 252, 240, 1)");
  glow.addColorStop(0.35, "rgba(255, 236, 196, 0.65)");
  glow.addColorStop(1, "rgba(255, 236, 196, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  ctx.moveTo(32, 6);
  ctx.quadraticCurveTo(34, 30, 58, 32);
  ctx.quadraticCurveTo(34, 34, 32, 58);
  ctx.quadraticCurveTo(30, 34, 6, 32);
  ctx.quadraticCurveTo(30, 30, 32, 6);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function MailboxThreeCanvas({
  onReady,
}: {
  onReady?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

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
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 25);
    camera.position.set(0, 0.08, 5.2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    const sunLight = new THREE.DirectionalLight(0xfff5e8, 1.85);
    sunLight.position.set(2.8, 3.6, 4.5);
    const fillLight = new THREE.PointLight(0xa2e1ec, 1.15, 10);
    fillLight.position.set(-2.5, -1.2, 3.2);
    scene.add(ambientLight, sunLight, fillLight);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const root = new THREE.Group();
    scene.add(root);

    // Envelope cluster (tilted -8 deg like the signature stationery card)
    const envelopeRig = new THREE.Group();
    envelopeRig.position.set(-0.18, -0.22, 0.15);
    envelopeRig.rotation.set(0.06, -0.18, -0.14);
    root.add(envelopeRig);

    const bodyGeo = track(
      new THREE.ExtrudeGeometry(createRoundedRectShape(1.92, 1.24, 0.14), {
        depth: 0.08,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025,
      }),
    );
    bodyGeo.center();
    const bodyMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xd5eef1,
        roughness: 0.42,
        metalness: 0.04,
      }),
    );
    const envelopeBody = new THREE.Mesh(bodyGeo, bodyMat);
    envelopeRig.add(envelopeBody);

    // Letter sheet peeking out of the pocket
    const letterGeo = track(
      new THREE.ExtrudeGeometry(createRoundedRectShape(1.62, 1.04, 0.08), {
        depth: 0.03,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      }),
    );
    letterGeo.center();
    const letterMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfffcf7,
        roughness: 0.5,
        metalness: 0.02,
      }),
    );
    const letterMesh = new THREE.Mesh(letterGeo, letterMat);
    letterMesh.position.set(0, 0.16, 0.035);
    envelopeRig.add(letterMesh);

    // Front pocket fold
    const pocketShape = new THREE.Shape();
    pocketShape.moveTo(-0.94, -0.6);
    pocketShape.lineTo(0.94, -0.6);
    pocketShape.lineTo(0.94, 0.24);
    pocketShape.lineTo(0, -0.12);
    pocketShape.lineTo(-0.94, 0.24);
    pocketShape.closePath();
    const pocketGeo = track(
      new THREE.ExtrudeGeometry(pocketShape, {
        depth: 0.035,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      }),
    );
    const pocketMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xbde3e8,
        roughness: 0.38,
        metalness: 0.05,
      }),
    );
    const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
    pocketMesh.position.set(0, 0, 0.055);
    envelopeRig.add(pocketMesh);

    // Top triangular flap pivoted along top edge so hover gently lifts it
    const flapPivot = new THREE.Group();
    flapPivot.position.set(0, 0.6, 0.068);
    envelopeRig.add(flapPivot);

    const flapShape = new THREE.Shape();
    flapShape.moveTo(-0.93, 0);
    flapShape.lineTo(0.93, 0);
    flapShape.lineTo(0, -0.66);
    flapShape.closePath();
    const flapGeo = track(
      new THREE.ExtrudeGeometry(flapShape, {
        depth: 0.024,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      }),
    );
    const flapMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x9fd5de,
        roughness: 0.36,
        metalness: 0.06,
      }),
    );
    const flapMesh = new THREE.Mesh(flapGeo, flapMat);
    flapPivot.add(flapMesh);

    // Wax heart seal clasp
    const sealGroup = new THREE.Group();
    sealGroup.position.set(0, -0.06, 0.115);
    envelopeRig.add(sealGroup);

    const sealDiscGeo = track(new THREE.CylinderGeometry(0.22, 0.24, 0.05, 32));
    sealDiscGeo.rotateX(Math.PI / 2);
    const sealDiscMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xf2b5c2,
        roughness: 0.28,
        metalness: 0.12,
      }),
    );
    sealGroup.add(new THREE.Mesh(sealDiscGeo, sealDiscMat));

    const heartGeo = track(
      new THREE.ExtrudeGeometry(createHeartShape(0.42), {
        depth: 0.035,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      }),
    );
    heartGeo.center();
    const heartMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xd96b82,
        roughness: 0.25,
        metalness: 0.1,
      }),
    );
    const sealHeart = new THREE.Mesh(heartGeo, heartMat);
    sealHeart.position.set(0, 0.01, 0.03);
    sealGroup.add(sealHeart);

    // Floating postage stamp card behind upper-right
    const stampRig = new THREE.Group();
    stampRig.position.set(0.68, 0.52, -0.28);
    stampRig.rotation.set(-0.08, -0.22, -0.2);
    root.add(stampRig);

    const stampOuterGeo = track(
      new THREE.ExtrudeGeometry(createRoundedRectShape(1.06, 1.26, 0.09), {
        depth: 0.04,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      }),
    );
    stampOuterGeo.center();
    const stampOuterMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfffaf4,
        roughness: 0.45,
        metalness: 0.03,
      }),
    );
    stampRig.add(new THREE.Mesh(stampOuterGeo, stampOuterMat));

    const stampInnerGeo = track(new THREE.PlaneGeometry(0.82, 0.96));
    const stampInnerMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfbe5dc,
        roughness: 0.5,
      }),
    );
    const stampInner = new THREE.Mesh(stampInnerGeo, stampInnerMat);
    stampInner.position.set(0, 0.03, 0.036);
    stampRig.add(stampInner);

    const stampHeart = new THREE.Mesh(heartGeo, sealDiscMat);
    stampHeart.scale.setScalar(1.15);
    stampHeart.position.set(0, 0.06, 0.048);
    stampRig.add(stampHeart);

    // Floating mini keepsake hearts
    const floatingHeartA = new THREE.Mesh(heartGeo, heartMat);
    floatingHeartA.scale.setScalar(0.85);
    floatingHeartA.position.set(-0.98, 0.62, 0.4);
    root.add(floatingHeartA);

    const mintHeartMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x5bb8c9,
        roughness: 0.28,
        metalness: 0.08,
      }),
    );
    const floatingHeartB = new THREE.Mesh(heartGeo, mintHeartMat);
    floatingHeartB.scale.setScalar(0.68);
    floatingHeartB.position.set(0.95, -0.45, 0.48);
    root.add(floatingHeartB);

    // Sparkle stardust particles
    const sparkleCount = 26;
    const sparklePos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      const a = (i / sparkleCount) * Math.PI * 2 + (i % 4) * 0.4;
      const r = 0.85 + ((i * 37) % 100) / 100 * 1.15;
      sparklePos[i * 3] = Math.cos(a) * r;
      sparklePos[i * 3 + 1] = (((i * 53) % 100) / 100 - 0.45) * 1.9;
      sparklePos[i * 3 + 2] = Math.sin(a) * 0.65;
    }
    const sparkleGeo = track(new THREE.BufferGeometry());
    sparkleGeo.setAttribute("position", new THREE.BufferAttribute(sparklePos, 3));
    const sparkleTex = createSparkleTexture();
    if (sparkleTex) track(sparkleTex);
    const sparkleMat = track(
      new THREE.PointsMaterial({
        color: 0xe2b165,
        size: 0.22,
        map: sparkleTex ?? undefined,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    );
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    root.add(sparkles);

    let dark = isDarkDocument();
    const applyTheme = () => {
      if (dark) {
        bodyMat.color.setHex(0x234752);
        letterMat.color.setHex(0x283c4c);
        pocketMat.color.setHex(0x2b5663);
        flapMat.color.setHex(0x356978);
        stampOuterMat.color.setHex(0x223645);
        stampInnerMat.color.setHex(0x344756);
        sealDiscMat.color.setHex(0xe89eb0);
        heartMat.color.setHex(0xf4b4c4);
        mintHeartMat.color.setHex(0x78d5e5);
        sparkleMat.color.setHex(0xf4cf8b);
      } else {
        bodyMat.color.setHex(0xd6eff2);
        letterMat.color.setHex(0xfffdf9);
        pocketMat.color.setHex(0xbee4ea);
        flapMat.color.setHex(0xa3d7e0);
        stampOuterMat.color.setHex(0xfffaf4);
        stampInnerMat.color.setHex(0xfce7df);
        sealDiscMat.color.setHex(0xf4bbc7);
        heartMat.color.setHex(0xdc6b82);
        mintHeartMat.color.setHex(0x4ba9bc);
        sparkleMat.color.setHex(0xdca855);
      }
    };
    applyTheme();

    const updateSize = () => {
      const width = container.clientWidth || 260;
      const height = container.clientHeight || 220;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const scale = Math.min(1.06, Math.max(0.76, (width / 290) * 0.96));
      root.scale.setScalar(scale);
    };
    updateSize();

    // Pointer / touch parallax on the surrounding hero card
    const pointerTarget = { x: 0, y: 0, hover: 0 };
    const pointerCurrent = { x: 0, y: 0, hover: 0 };
    const hostCard = container.closest(".memory-welcome") ?? container;

    const onPointerMove = (event: Event) => {
      if (!(event instanceof PointerEvent)) return;
      const rect = hostCard.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerTarget.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
      pointerTarget.hover = 1;
    };
    const onPointerLeave = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
      pointerTarget.hover = 0;
    };
    hostCard.addEventListener("pointermove", onPointerMove, { passive: true });
    hostCard.addEventListener("pointerleave", onPointerLeave, { passive: true });

    let rafId: number | null = null;
    let inView = true;
    let reducedMotion = isReducedMotionPreferred();
    let announcedReady = false;
    const startClock = performance.now();

    const renderFrame = (now: number) => {
      const t = (now - startClock) * 0.001;
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.08;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.08;
      pointerCurrent.hover += (pointerTarget.hover - pointerCurrent.hover) * 0.08;

      const floatY = reducedMotion ? 0 : Math.sin(t * 1.35) * 0.07;
      envelopeRig.position.y = -0.2 + floatY + pointerCurrent.y * 0.08;
      envelopeRig.rotation.y = -0.18 + pointerCurrent.x * 0.28 + (reducedMotion ? 0 : Math.cos(t * 0.8) * 0.05);
      envelopeRig.rotation.x = 0.06 - pointerCurrent.y * 0.18;

      // Gently lift the top flap & slide the letter upward when hovered/touched
      flapPivot.rotation.x = -0.12 - pointerCurrent.hover * 0.42 - (reducedMotion ? 0 : (Math.sin(t * 1.35) + 1) * 0.06);
      letterMesh.position.y = 0.15 + pointerCurrent.hover * 0.14;

      stampRig.position.y = 0.52 + (reducedMotion ? 0 : Math.sin(t * 1.1 + 1.4) * 0.06) - pointerCurrent.y * 0.06;
      stampRig.rotation.z = -0.2 + pointerCurrent.x * 0.08;

      floatingHeartA.position.y = 0.62 + (reducedMotion ? 0 : Math.sin(t * 1.7 + 0.5) * 0.09);
      floatingHeartA.rotation.y = reducedMotion ? 0.2 : t * 0.7;
      floatingHeartB.position.y = -0.45 + (reducedMotion ? 0 : Math.cos(t * 1.5 + 2.0) * 0.08);
      floatingHeartB.rotation.y = reducedMotion ? -0.25 : -t * 0.65;

      if (!reducedMotion) {
        sparkles.rotation.z = Math.sin(t * 0.35) * 0.08;
        sparkles.position.y = Math.sin(t * 0.9) * 0.05;
      }

      renderer.render(scene, camera);
      if (!announcedReady) {
        announcedReady = true;
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

    const themeObserver = new MutationObserver(() => {
      dark = isDarkDocument();
      applyTheme();
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
      hostCard.removeEventListener("pointermove", onPointerMove);
      hostCard.removeEventListener("pointerleave", onPointerLeave);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      motionMedia.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", syncLoop);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className="size-full" />;
}
