"use client";

import { motion } from "framer-motion";
import { DialectRegion } from "@/types";
import { DIALECT_REGIONS } from "@/data/regions";

interface RegionSelectorProps {
  value: DialectRegion | null;
  onChange: (region: DialectRegion | null) => void;
  showAll?: boolean;
}

export default function RegionSelector({
  value,
  onChange,
  showAll = false,
}: RegionSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* All Regions pill */}
      {showAll && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            value === null
              ? "bg-white/20 text-white ring-2 ring-white/40"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
          }`}
        >
          🌍 All Regions
        </motion.button>
      )}

      {/* Region pills */}
      {DIALECT_REGIONS.map((region) => {
        const isSelected = value === region.id;
        return (
          <motion.button
            key={region.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(region.id as DialectRegion)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? "text-white ring-2"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
            }`}
            style={
              isSelected
                ? {
                    backgroundColor: `${region.color}30`,
                    boxShadow: `0 0 0 2px ${region.color}`,
                  }
                : undefined
            }
          >
            <span
              className="mr-1.5 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: region.color }}
            />
            {region.kannada_name}
          </motion.button>
        );
      })}
    </div>
  );
}
