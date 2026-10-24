"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Html,
  PresentationControls,
  Text,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import type { CulturalArtifact } from "@/types";

// ---------------------------------------------------------------------------
// Fallback 3D model – a simple box with the artifact name as floating text
// ---------------------------------------------------------------------------
function FallbackModel({ name }: { name: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#e8a87c"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.18}
        color="#4a4a4a"
        anchorX="center"
        anchorY="bottom"
        maxWidth={2}
      >
        {name}
      </Text>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.12}
        color="#888"
        anchorX="center"
        anchorY="top"
      >
        Model Coming Soon
      </Text>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Artifact GLTF model loader
// ---------------------------------------------------------------------------
function ArtifactModel({ url, name }: { url?: string; name: string }) {
  if (!url) {
    return <FallbackModel name={name} />;
  }

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1} />;
  } catch {
    return <FallbackModel name={name} />;
  }
}

// ---------------------------------------------------------------------------
// Loading spinner shown inside Suspense boundary
// ---------------------------------------------------------------------------
function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading 3D model…</p>
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Info panel overlay
// ---------------------------------------------------------------------------
function InfoPanel({
  artifact,
  onClose,
}: {
  artifact: CulturalArtifact;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute right-0 top-0 z-20 h-full w-80 overflow-y-auto bg-white/90 p-6 shadow-xl backdrop-blur-md dark:bg-gray-900/90"
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        aria-label="Close info panel"
      >
        ✕
      </button>

      <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
        {artifact.name}
      </h2>
      {artifact.kannada_name && (
        <p className="mb-3 text-lg text-amber-700 dark:text-amber-400">
          {artifact.kannada_name}
        </p>
      )}

      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {artifact.description}
      </p>

      {artifact.region && (
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">
            Region
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {artifact.region}
          </p>
        </div>
      )}

      {artifact.period && (
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">
            Period
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {artifact.period}
          </p>
        </div>
      )}

      {artifact.associated_phrases && artifact.associated_phrases.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">
            Associated Phrases
          </span>
          <ul className="mt-1 space-y-1">
            {artifact.associated_phrases.map((phrase, i) => (
              <li
                key={i}
                className="rounded bg-amber-50 px-2 py-1 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              >
                {phrase}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main ArtifactViewer component
// ---------------------------------------------------------------------------
export interface ArtifactViewerProps {
  artifact: CulturalArtifact;
}

export default function ArtifactViewer({ artifact }: ArtifactViewerProps) {
  const [showInfo, setShowInfo] = useState(true);
  const [arSupported, setArSupported] = useState(false);

  // Check WebXR AR availability
  useEffect(() => {
    if (typeof navigator !== "undefined" && "xr" in navigator) {
      (navigator as any).xr
        ?.isSessionSupported?.("immersive-ar")
        .then((supported: boolean) => setArSupported(supported))
        .catch(() => setArSupported(false));
    }
  }, []);

  const handleEnterAR = async () => {
    try {
      const session = await (navigator as any).xr.requestSession(
        "immersive-ar",
        { requiredFeatures: ["hit-test"] }
      );
      // In a full implementation the session would be bound to the
      // Three.js renderer. For now we simply log it.
      console.log("AR session started", session);
    } catch (err) {
      console.error("Failed to start AR session:", err);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      {/* ---------- 3D Canvas ---------- */}
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        className="!absolute inset-0"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

          <PresentationControls
            global
            snap
            speed={1.5}
            zoom={0.8}
            rotation={[0, -Math.PI / 6, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <ArtifactModel
              url={artifact.model_url}
              name={artifact.name}
            />
          </PresentationControls>

          <OrbitControls
            enablePan={false}
            minDistance={1.5}
            maxDistance={6}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* ---------- Toolbar ---------- */}
      <div className="absolute left-4 top-4 z-10 flex gap-2">
        <button
          onClick={() => setShowInfo((v) => !v)}
          className="rounded-lg bg-white/80 px-3 py-2 text-sm font-medium shadow backdrop-blur-sm transition hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
        >
          {showInfo ? "Hide Info" : "Show Info"}
        </button>

        {arSupported && (
          <button
            onClick={handleEnterAR}
            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-amber-600"
          >
            Enter AR
          </button>
        )}
      </div>

      {/* ---------- Info Panel ---------- */}
      <AnimatePresence>
        {showInfo && (
          <InfoPanel
            artifact={artifact}
            onClose={() => setShowInfo(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
