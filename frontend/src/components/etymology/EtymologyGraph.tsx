"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  EtymologyGraph as EtymologyGraphType,
  EtymologyNode,
  EtymologyEdge,
} from "@/types";
import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// Language‑origin color palette
// ---------------------------------------------------------------------------
const ORIGIN_COLORS: Record<string, string> = {
  Sanskrit: "#f59e0b",    // amber / orange
  Dravidian: "#22c55e",   // green
  Persian: "#3b82f6",     // blue
  Arabic: "#8b5cf6",      // violet
  Portuguese: "#ec4899",  // pink
  English: "#6366f1",     // indigo
  Prakrit: "#14b8a6",     // teal
  Kannada: "#ef4444",     // red
  Tamil: "#06b6d4",       // cyan
  Telugu: "#a855f7",      // purple
  default: "#94a3b8",     // slate
};

function getColor(origin?: string): string {
  if (!origin) return ORIGIN_COLORS.default;
  return ORIGIN_COLORS[origin] ?? ORIGIN_COLORS.default;
}

// ---------------------------------------------------------------------------
// Simple radial / tree layout
// ---------------------------------------------------------------------------
interface PositionedNode extends EtymologyNode {
  x: number;
  y: number;
}

function layoutNodes(
  nodes: EtymologyNode[],
  width: number,
  height: number
): PositionedNode[] {
  if (nodes.length === 0) return [];

  const cx = width / 2;
  const cy = height / 2;

  if (nodes.length === 1) {
    return [{ ...nodes[0], x: cx, y: cy }];
  }

  // Place the first (root) node at the center, others in a radial pattern
  const positioned: PositionedNode[] = [];
  positioned.push({ ...nodes[0], x: cx, y: cy });

  const remaining = nodes.slice(1);
  const radius = Math.min(width, height) * 0.35;
  const angleStep = (2 * Math.PI) / remaining.length;

  remaining.forEach((node, i) => {
    const angle = angleStep * i - Math.PI / 2;
    positioned.push({
      ...node,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  });

  return positioned;
}

// ---------------------------------------------------------------------------
// Curved edge path (quadratic bezier)
// ---------------------------------------------------------------------------
function edgePath(
  source: PositionedNode,
  target: PositionedNode
): string {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  // Offset the control point perpendicular to the line for a nice curve
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const offset = 30;
  const cpX = midX - (dy / (Math.sqrt(dx * dx + dy * dy) || 1)) * offset;
  const cpY = midY + (dx / (Math.sqrt(dx * dx + dy * dy) || 1)) * offset;

  return `M ${source.x} ${source.y} Q ${cpX} ${cpY} ${target.x} ${target.y}`;
}

// ---------------------------------------------------------------------------
// Tooltip for node details
// ---------------------------------------------------------------------------
function NodeTooltip({
  node,
  onClose,
}: {
  node: PositionedNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-30 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      style={{ left: node.x + 40, top: node.y - 30 }}
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        aria-label="Close tooltip"
      >
        ✕
      </button>
      <h4 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
        {node.word}
      </h4>
      {node.meaning && (
        <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
          {node.meaning}
        </p>
      )}
      <div className="flex flex-wrap gap-2 text-xs">
        {node.language_origin && (
          <span
            className="rounded-full px-2 py-0.5 font-medium text-white"
            style={{ backgroundColor: getColor(node.language_origin) }}
          >
            {node.language_origin}
          </span>
        )}
        {node.time_period && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {node.time_period}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main EtymologyGraph component
// ---------------------------------------------------------------------------
export interface EtymologyGraphProps {
  graph: EtymologyGraphType | null;
  isLoading: boolean;
}

export default function EtymologyGraph({
  graph,
  isLoading,
}: EtymologyGraphProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [localGraph, setLocalGraph] = useState<EtymologyGraphType | null>(
    graph
  );
  const [selectedNode, setSelectedNode] = useState<PositionedNode | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });

  // Sync prop → local state
  useEffect(() => {
    setLocalGraph(graph);
  }, [graph]);

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(entry.contentRect.height, 400),
        });
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Layout
  const positioned = useMemo(
    () =>
      layoutNodes(
        localGraph?.nodes ?? [],
        dimensions.width,
        dimensions.height
      ),
    [localGraph, dimensions]
  );

  const nodeMap = useMemo(() => {
    const map = new Map<string, PositionedNode>();
    positioned.forEach((n) => map.set(n.id, n));
    return map;
  }, [positioned]);

  // Search handler
  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchTerm.trim()) return;
      setSearching(true);
      setSelectedNode(null);
      try {
        const result = await api.getEtymology(searchTerm.trim());
        setLocalGraph(result);
      } catch (err) {
        console.error("Etymology fetch failed:", err);
      } finally {
        setSearching(false);
      }
    },
    [searchTerm]
  );

  const loading = isLoading || searching;
  const edges: EtymologyEdge[] = localGraph?.edges ?? [];

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Look up a Kannada word…"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(ORIGIN_COLORS)
          .filter(([k]) => k !== "default")
          .map(([origin, color]) => (
            <span key={origin} className="flex items-center gap-1">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              {origin}
            </span>
          ))}
      </div>

      {/* Graph area */}
      <div
        ref={containerRef}
        className="relative min-h-[400px] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
      >
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-gray-900/60">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        )}

        {!localGraph && !loading && (
          <div className="flex h-full min-h-[400px] items-center justify-center text-gray-400">
            Search for a word to see its etymology graph
          </div>
        )}

        {localGraph && (
          <svg
            width={dimensions.width}
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="select-none"
          >
            {/* Edges */}
            {edges.map((edge, i) => {
              const sourceId = edge.source || edge.source_id;
              const targetId = edge.target || edge.target_id;
              const source = sourceId ? nodeMap.get(sourceId) : undefined;
              const target = targetId ? nodeMap.get(targetId) : undefined;
              if (!source || !target) return null;

              const path = edgePath(source, target);
              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;

              return (
                <g key={`edge-${i}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                    className="dark:stroke-gray-600"
                  />
                  {edge.relationship && (
                    <text
                      x={midX}
                      y={midY - 8}
                      textAnchor="middle"
                      className="fill-gray-400 text-[10px] dark:fill-gray-500"
                    >
                      {edge.relationship}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {positioned.map((node, i) => {
              const color = getColor(node.language_origin);
              const isSelected = selectedNode?.id === node.id;
              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, type: "spring" }}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setSelectedNode(isSelected ? null : node)
                  }
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 32 : 28}
                    fill={color}
                    fillOpacity={0.15}
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    x={node.x}
                    y={node.y - 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-800 text-xs font-semibold dark:fill-white"
                  >
                    {node.word}
                  </text>
                  {node.language_origin && (
                    <text
                      x={node.x}
                      y={node.y + 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-400 dark:fill-gray-500"
                      fontSize={9}
                    >
                      {node.language_origin}
                    </text>
                  )}
                  {node.time_period && (
                    <text
                      x={node.x}
                      y={node.y + 44}
                      textAnchor="middle"
                      className="fill-gray-400 dark:fill-gray-500"
                      fontSize={8}
                    >
                      {node.time_period}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {selectedNode && (
            <NodeTooltip
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
