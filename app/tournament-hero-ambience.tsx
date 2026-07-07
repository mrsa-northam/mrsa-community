"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function createCourtLines() {
  const points = [
    [-2.8, -1.55, 2.8, -1.55],
    [-2.8, 1.55, 2.8, 1.55],
    [-2.8, -1.55, -2.8, 1.55],
    [2.8, -1.55, 2.8, 1.55],
    [0, -1.55, 0, 1.55],
    [-2.8, 0, 2.8, 0],
    [-1.35, -1.55, -1.35, 1.55],
    [1.35, -1.55, 1.35, 1.55],
    [-2.8, -0.58, 2.8, -0.58],
    [-2.8, 0.58, 2.8, 0.58]
  ];
  const vertices = points.flatMap(([x1, z1, x2, z2]) => [x1, 0.01, z1, x2, 0.01, z2]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return geometry;
}

export function TournamentHeroAmbience() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.className = "h-full w-full";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 4.6, 5.6);
    camera.lookAt(0, 0, 0);

    const courtGroup = new THREE.Group();
    courtGroup.rotation.y = -0.1;
    scene.add(courtGroup);

    const courtGeometry = new THREE.PlaneGeometry(6.6, 3.9, 1, 1);
    const courtMaterial = new THREE.MeshBasicMaterial({
      color: 0x2ac06d,
      opacity: 0.14,
      transparent: true,
      side: THREE.DoubleSide
    });
    const court = new THREE.Mesh(courtGeometry, courtMaterial);
    court.rotation.x = -Math.PI / 2;
    courtGroup.add(court);

    const lineGeometry = createCourtLines();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xdfffd8,
      opacity: 0.28,
      transparent: true
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    courtGroup.add(lines);

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let animationFrame = 0;
    const render = (time = 0) => {
      const seconds = time / 1000;
      courtGroup.rotation.y = -0.1 + Math.sin(seconds * 0.16) * 0.06;
      lineMaterial.opacity = 0.2 + Math.sin(seconds * 0.9) * 0.05;
      renderer.render(scene, camera);
      if (!prefersReducedMotion && !document.hidden) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
        return;
      }
      render();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    render();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      courtGeometry.dispose();
      courtMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="pointer-events-none absolute inset-0 z-0 opacity-75 mix-blend-screen" ref={hostRef} aria-hidden="true" />;
}
