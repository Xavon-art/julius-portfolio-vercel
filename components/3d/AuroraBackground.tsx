"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const FOG_COLOR = new THREE.Color(0.992, 0.992, 0.976);

function AuroraField({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const sphere1Ref = useRef<THREE.Mesh>(null);
  const sphere2Ref = useRef<THREE.Mesh>(null);
  const sphere3Ref = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();
  const reduce = useReducedMotion();
  const targetZ = useRef(camera.position.z);

  useFrame((state) => {
    const t = reduce ? 0 : state.clock.getElapsedTime();
    const scroll = scrollProgress;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0.08 + scroll * 0.05,
        0.02,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -0.15 + scroll * 0.25,
        0.02,
      );
    }

    if (sphere1Ref.current) {
      const scale = 1.05 + Math.sin(t * 0.08 + scroll * 1.2) * 0.04;
      sphere1Ref.current.scale.setScalar(scale);
      sphere1Ref.current.rotation.x = t * 0.01;
      sphere1Ref.current.rotation.z = t * 0.008 + scroll * 0.02;
      sphere1Ref.current.position.x = Math.sin(t * 0.05 + scroll * 0.4) * 0.08;
      sphere1Ref.current.position.y = Math.cos(t * 0.04) * 0.05 + scroll * 0.08;
    }

    if (sphere2Ref.current) {
      const scale = 0.95 + Math.cos(t * 0.07 - scroll * 0.9) * 0.05;
      sphere2Ref.current.scale.setScalar(scale);
      sphere2Ref.current.rotation.y = t * 0.012 + scroll * 0.015;
      sphere2Ref.current.position.x = -Math.cos(t * 0.06 + scroll * 0.3) * 0.12;
      sphere2Ref.current.position.y = Math.sin(t * 0.05 + scroll * 0.5) * 0.08;
    }

    if (sphere3Ref.current) {
      const scale = 1.08 + Math.sin(t * 0.09 + scroll * 0.6) * 0.03;
      sphere3Ref.current.scale.setScalar(scale);
      sphere3Ref.current.rotation.x = -t * 0.009;
      sphere3Ref.current.rotation.z = Math.sin(t * 0.07) * 0.01 + scroll * 0.01;
      sphere3Ref.current.position.x = Math.sin(t * 0.04 - scroll * 0.25) * 0.06;
      sphere3Ref.current.position.y = -Math.cos(t * 0.06 + scroll * 0.7) * 0.07;
    }

    targetZ.current = 1.2 + scroll * 0.15;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.02);
  });

  const sizes = useMemo(() => {
    const w = viewport.width;
    const h = viewport.height;
    const base = Math.max(w, h) * 0.9;
    return {
      s1: base * 0.5,
      s2: base * 0.38,
      s3: base * 0.28,
    };
  }, [viewport.width, viewport.height]);

  return (
    <group ref={groupRef}>
      <Sphere ref={sphere1Ref} args={[sizes.s1, 128, 128]} position={[0.15, 0.1, -0.4]}>
        <MeshDistortMaterial
          color="#b8b5ff"
          attach="material"
          distort={0.25}
          speed={reduce ? 0.1 : 0.4}
          roughness={0.4}
          metalness={0.05}
          transparent
          opacity={0.16}
        />
      </Sphere>
      <Sphere ref={sphere2Ref} args={[sizes.s2, 128, 128]} position={[-0.25, -0.05, -0.6]}>
        <MeshDistortMaterial
          color="#b9e7ff"
          attach="material"
          distort={0.22}
          speed={reduce ? 0.08 : 0.35}
          roughness={0.45}
          metalness={0.05}
          transparent
          opacity={0.14}
        />
      </Sphere>
      <Sphere ref={sphere3Ref} args={[sizes.s3, 128, 128]} position={[0.05, -0.25, -0.8]}>
        <MeshDistortMaterial
          color="#ffe0b3"
          attach="material"
          distort={0.28}
          speed={reduce ? 0.1 : 0.42}
          roughness={0.4}
          metalness={0.05}
          transparent
          opacity={0.12}
        />
      </Sphere>
    </group>
  );
}

export function AuroraBackground({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty(
      "--aurora-progress",
      Math.min(Math.max(scrollProgress, 0), 1).toString(),
    );
  }, [scrollProgress]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(184,181,255,0.08) 0%, rgba(185,231,255,0.05) 50%, rgba(255,224,179,0.02) 100%), #fdfdf9",
        }}
      />
      <div className="absolute inset-0 h-full w-full">
        <Canvas
          camera={{ position: [0, 0, 1.2], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          frameloop={reduce ? "demand" : "always"}
        >
          <ambientLight intensity={0.2} color="#f5f7fb" />
          <pointLight intensity={0.15} position={[1, 1, 1]} color="#b8b5ff" />
          <pointLight intensity={0.12} position={[-1, -0.5, 1]} color="#b9e7ff" />
          <pointLight intensity={0.1} position={[0, -1, 0.5]} color="#ffe0b3" />
          <fog attach="fog" args={[FOG_COLOR, 1.8, 4]} />
          <AuroraField scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#fdfdf9] via-[#fdfdf9]/60 to-transparent"
      />
    </div>
  );
}